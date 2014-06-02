/*
 * MochaJS webdriver tests (PhantomJS & BrowserStack)
 * =============================================================================
 * - Uses http://webdriver.io/ for communicating with Selenium/BrowserStack
 * - Uses MochaJS as the test framework and Chai's should assertions
 * - Run with mocha mochachai.js --reporter spec
 * - Defaults to PhantomJS unless process.env.TESTING_ENV set to 'browserstack'
 *
 */


/*
 * Timeouts for the test runs (BrowserStack needs long timeouts)
 * -----------------------------------------------------------------------------
 * - http://oligofren.wordpress.com/2014/05/27/running-karma-tests-on-browserstack/
 */
var timeoutInSeconds = 60;//in seconds
var timeoutInMillis = timeoutInSeconds * 1000;

/*
 * Screenshot folder location
 * -----------------------------------------------------------------------------
 * - emptied before every run
 */
var screenshotsFolder = './screenshots/';


/*
 * Require modules and do some setup
 * -----------------------------------------------------------------------------
 */
var should = require('chai').should();
var webdriverjs = require('webdriverjs');
var chalk = require('chalk');
var slugify = require('slugify');
var changeCase = require('change-case');
var rimraf = require('rimraf');
var path = require('path');
var glob = require("glob");
var argv = require('yargs').argv;
var browserConfigFilePath = argv.browser;
var fs = require('fs')
var assert = require('assert')
var browserConfig;

/*
 * If browser config is specied, make sure it exists
 * -----------------------------------------------------------------------------
 */
if (browserConfigFilePath != null) {
  assert.ok(fs.existsSync(browserConfigFilePath), 'Browser config file not found at path: ' + browserConfigFilePath)
  browserConfig = require(path.resolve(browserConfigFilePath));
}


/*
 * Helper function used when printing out browser information
 * -----------------------------------------------------------------------------
 */
function browserString() {

  var osString;
  var browserString = browserConfig.browser;

  if (browserConfig['os'] != null) {

    osString = browserConfig['os'];

    if (browserConfig['os_version'] != null) {
      osString += ' '+browserConfig['os_version'];
    }

  }

  if (browserConfig.platform != null) {
    osString = '('+browserConfig.platform+') '+browserConfig.device;
  }

  if (browserConfig['browser_version'] != null) {
    browserString += ' v'+browserConfig['browser_version'];
  }

  return browserString+' browser running on '+osString;

}


/*
 * Decision point: Local PhantomJS vs. BrowserStack
 * -----------------------------------------------------------------------------
 * - Uses BrowserStack if --browser=<PATH-TO-BROWSER-CONFIG> argument specified
 * - Local PhantomJS requires PhantomJS and Selenium Standalone
 * - start selenium with: java -jar path/to/your/selenium-server-standalone-<VERSION>.jar
 * - BrowserStack requires CLI environment variables BROWSER_STACK_USERNAME and
 *   BROWSER_STACK_ACCESS_KEY to be set
 */
var client;

if (browserConfig != null) {

  if (process.env.BROWSER_STACK_USERNAME == null) {
    console.log(chalk.red('\n\n  You need to set your BrowserStack username as BROWSER_STACK_USERNAME enviroment variable!\n\n'));
    process.exit(1);
  }

  if (process.env.BROWSER_STACK_ACCESS_KEY == null) {
    console.log(chalk.red('\n\n  You need to set your BrowserStack access key as BROWSER_STACK_ACCESS_KEY enviroment variable!\n\n'));
    process.exit(1);
  }

  console.log(chalk.green('\n  Testing against BrowserStack:'));
  console.log('  '+browserString());

  client = webdriverjs.remote({
    desiredCapabilities: browserConfig,
    host: 'hub.browserstack.com',
    port: 80,
    user : process.env.BROWSER_STACK_USERNAME,
    key: process.env.BROWSER_STACK_ACCESS_KEY,
    logLevel: 'silent'
  });

} else {

  console.log(chalk.green('\n  Testing against local PhantomJS:'));

  client = webdriverjs.remote({
    desiredCapabilities: {
      browserName: 'phantomjs'
    }
  });

}


/*
 * Example test scenario
 * -----------------------------------------------------------------------------
 * - What's up with the "done": http://visionmedia.github.io/mocha/#asynchronous-code
 */
describe('Github homepage', function(){

  this.timeout( timeoutInMillis);

  /*
   * Callback called once before running the test scenario (describe block)
   * ---------------------------------------------------------------------------
   */
  before(function(done){

    if(fs.existsSync(screenshotsFolder)) {

      glob.sync(screenshotsFolder+'error-screenshot-*.png').forEach(function(value, index, array) {
        fs.unlinkSync(value);
      });

    } else {

      fs.mkdirSync(screenshotsFolder);

    }

    client.init(done);
  });

  /*
   * Callback called once after running the test scenario (describe block)
   * ---------------------------------------------------------------------------
   */
  after(function(done) {
    client.end(done);
  });

  /*
   * Callback called after every test (it block)
   * ---------------------------------------------------------------------------
   */
  afterEach(function() {

    if(this.currentTest.state === 'failed') {

      client.saveScreenshot(screenshotsFolder+'error-when-testing-'+changeCase.camelCase(slugify(this.currentTest.title))+'.png').end();
    }

  });

  /*
   * Test #1
   * ---------------------------------------------------------------------------
   */
  it('should have a title',function(done) {
    client
    .url('https://github.com/')
    .getTitle(function(err, title) {
      should.not.exist(err);
      title.should.equal('GitHub · Build software better, together.');
    })
    .call(done);
  });

  /*
   * Test #2
   * ---------------------------------------------------------------------------
   */
  it('should have a properly sized logo',function(done) {
    client
    .url('https://github.com/')
    .getElementSize('.header-logo-wordmark', function(err, result) {
      should.not.exist(err);
      result.height.should.equal(32);
      result.width.should.equal(89);
    })
    .call(done);
  });


});

