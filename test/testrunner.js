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
    labelString += ' [latest stable version]';
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

