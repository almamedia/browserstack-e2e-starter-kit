/*
 * Test runner
 * =============================================================================
 */


/*
 * Require modules
 * -----------------------------------------------------------------------------
 */
var webdriverjs = require('webdriverjs');
var os = require('os');
var path = require('path');
var _ = require('lodash');
var shell = require('shelljs');
global.should = require('chai').should();//exposed as global for the suites
var BrowserStackTunnel = require('browserstacktunnel-wrapper');

/*
 * Require all test suites
 * -----------------------------------------------------------------------------
 * - uses https://www.npmjs.org/package/require-directory
 */
var suites = require('./suites');


/*
 * Require browser configurations
 * -----------------------------------------------------------------------------
 */
var browsers = require('./browsers.json');


/*
 * Detect if PhantomJS mode is called
 * -----------------------------------------------------------------------------
 */
var phantom = process.env.HEADLESS_PHANTOM || false;

if (phantom) {

  browsers = [
    {
      "browserName"   : "phantom",
      "version"       : String(shell.exec('phantomjs -v', {silent:true}).output).trim() || 'version unknown',
      "os"            : os.type()+' '+os.arch(),
      "os_version"    : os.release(),
      "resolution"    : "headless"
    }
  ]

}


/*
 * Check Browserstack username & access key (if not in PhantomJS mode)
 * -----------------------------------------------------------------------------
 */
if (!phantom && process.env.BROWSERSTACK_USERNAME == null) {
  throw 'You need to set your BrowserStack username as BROWSERSTACK_USERNAME enviroment variable!';
}

if (!phantom && process.env.BROWSERSTACK_ACCESS_KEY == null) {
  throw 'You need to set your BrowserStack access key as BROWSERSTACK_ACCESS_KEY enviroment variable!';
}

/*
 * Configure BrowserStack SSH tunnel for local testing
 * https://www.browserstack.com/automate/node#setting-local-tunnel
 * -----------------------------------------------------------------------------
 * https://www.npmjs.org/package/browserstacktunnel-wrapper
 */
var browserStackTunnel;
var myTunnelIdentifier = 'E2E-starter-kit-example';
var browserstackbinfolder = path.resolve('./');

if (!phantom) {

  browserStackTunnel = new BrowserStackTunnel({
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    hosts: [{
      name: 'localhost',
      port: 3000,
      sslFlag: 0
    }],
    osxBin: browserstackbinfolder, // optionally override the default bin directory for the OSX binary
    linux32Bin: browserstackbinfolder, // optionally override the default bin directory for the Linux 32 bit binary
    linux64Bin: browserstackbinfolder, // optionally override the default bin directory for the Linux 64 bit binary
    win32Bin: browserstackbinfolder, // optionally override the default bin directory for the win32 binary
    tunnelIdentifier: myTunnelIdentifier, // optionally set the -tunnelIdentifier option
    //skipCheck: true, // optionally set the -skipCheck option
    v: false//, // optionally set the -v (verbose) option
    //proxyUser: PROXY_USER, // optionally set the -proxyUser option
    //proxyPass: PROXY_PASS, // optionally set the -proxyPass option
    //proxyPort: PROXY_PORT, // optionally set the -proxyPort option
    //proxyHost: PROXY_HOST // optionally set the -proxyHost option
  });

}


/*
 * Helper function for building human readable browser name/version/os string
 * -----------------------------------------------------------------------------
 * - It's one damn ugly function, but who cares...
 */
function generateBrowserLabel(browser) {
  var labelString = '';
  labelString += String(browser['browserName']).trim().toLowerCase() == 'ie' ? 'Internet Explorer' : browser['browserName'];
  if(browser['version'] ){
    labelString += ' ['+browser['version']+']';
  } else if(!browser['device']) {
    labelString += ' [latest stable]';
  }
  labelString += ' '+browser['os'];
  labelString += browser['os_version'] ? ' '+browser['os_version'] : '';
  labelString += browser['device'] ? ' '+browser['device'] : '';
  labelString += browser['deviceOrientation'] ? ' '+browser['deviceOrientation'] : '';
  labelString += browser['resolution'] ? ' '+browser['resolution'] : '';
  return labelString;
}


/*
 * Helper function to setup the webdriver.io client
 * -----------------------------------------------------------------------------
 */
function setupClient(browser) {

  var client = {};

  if (phantom) {

    client = webdriverjs.remote({
      desiredCapabilities: {
        browserName: 'phantomjs'
      },
      logLevel: 'silent'//change to 'verbose' if having problems...
    });
  } else {

    browser['browserstack.debug'] = true;
    browser['browserstack.local'] = true;
    browser['browserstack.localIdentifier'] = myTunnelIdentifier;
    browser['build'] = 'Example';
    browser['project'] = 'E2E-starter-kit';

    client = webdriverjs.remote({
      desiredCapabilities: browser,
      host: 'hub.browserstack.com',
      port: 80,
      user : process.env.BROWSERSTACK_USERNAME,
      key: process.env.BROWSERSTACK_ACCESS_KEY,
      logLevel: 'silent'//change to 'verbose' if having problems...
    });
  }

  return client;
}


/*
 * Run all tests recursively on all browsers
 * -----------------------------------------------------------------------------
 */
describe('End-to-end tests', function() {

  /*
   * BrowserStack tunnel setup
   * -----------------------------------------------------------------------------
   */
  before(function(done) {

    if (!phantom) {

      // This requires a huge timeout as the setup takes some time and it might download the binary if the machine doesn't have it yet!
      this.timeout(60000);

      //console.log('BrowserStackTunnel: Starting...');

      browserStackTunnel.start(function(error) {
        if (error) {
          done(error);
        } else {
          // tunnel has started
          //console.log('BrowserStackTunnel: Started!\n');
          //console.log('Running tests...\n');
          done();
        }
      });
    } else {
      done();
    }
  });

  /*
   * BrowserStack tunnel teardown
   * -----------------------------------------------------------------------------
   */
  after(function(done) {
    if (!phantom) {
      browserStackTunnel.stop(function(error) {
        if (error) {
          done(error);
        } else {
          // tunnel has stopped
          //console.log('BrowserStackTunnel: Stopped!');
          done();
        }
      });
    } else {
      done();
    }
  });



  _.each(browsers, function(browser) {

    var client = setupClient(browser);

    var browserLabel = generateBrowserLabel(browser);

    describe(browserLabel, function(){

      /*
       * Set time out for all suites (within on browser)
       * -------------------------------------------------------------------------
       * - Be generous, you shouldn't be running e2e tests every minute...
       */
      this.timeout(60*60*1000);

      /*
       * Reset browser after each suite
       * -------------------------------------------------------------------------
       * - deletes cookies set by test suite
       * - resets the client to url about:blank after every test suite
       * - patch "afterEachDescribe"
       *   - stolen from: https://github.com/visionmedia/mocha/issues/911
       *   - iterates over all suites and attaches afterAll listener manually
       */
      before(function(){
        var that = this;
        client.init(function callbackAfterClientInit(){
          _.each(that.test.parent.suites, function process(suite){
            suite.afterAll(function resetClient(){
              client.deleteCookie();
              client.url('about:blank');
            });
          });
        });
      });



      /*
       * Check that there are some tests to be run
       * -------------------------------------------------------------------------
       */
      if(Object.keys(suites).length<1) throw new Error('No test suites found.');

      /*
       * Run all test suites recursively
       * -------------------------------------------------------------------------
       * - Actually generates the test suites runtime
       * - TODO: figure out if there's some "classy" way of looping the tests...
       */
      _.each(suites, function(suite){
        if (typeof suite === 'function') return suite(client);
        _.each(suite, function(suiteItem){
          if (typeof suiteItem === 'function') return suiteItem(client);
          _.each(suiteItem, function(suiteSubItem){
            if (typeof suiteSubItem === 'function') return suiteSubItem(client);
          });
        });
      });

      /*
       * Close the browser after all suites have been tested
       * -------------------------------------------------------------------------
       * - To prevent BrowserStack sessions hanging we first call end() and then
       *   endAll just to be sure
       */
      after(function(done){
        client.end(function callbackAfterClientEnd(err){
          if(err) console.log(err);
          client.endAll(function callbackAfterClientEndAll(err){
            if(err) console.log(err);
            client.call(done);
          })
        });
      });

    });

  });

});

