/*
 * Require modules and do some setup
 * -----------------------------------------------------------------------------
 */
var path = require('path');
var changeCase = require('change-case');
var should = require('chai').should();
var async = require('async');
var webdriverjs = require('webdriverjs');
var screenshotHandler = require('./lib/screenshot-handler.js');
var _ = require('lodash');
var test = require('./example1.js');


global.should = should;

/*
global.client = webdriverjs.remote({
  desiredCapabilities: {
    browserName: 'phantomjs'
  }
});
*/

var timeoutInSeconds = 60;//in seconds
var timeoutInMillis = timeoutInSeconds * 1000;

var browsers = [
  {
    "browser": "firefox",
    "os": "Windows",
    "os_version": "XP",
    "resolution": "1024x768"
  },
  {
    "browser": "chrome",
    "os": "Windows",
    "os_version": "7",
    "resolution": "1366x768"
  },
  {
    "browser": "IE",
    "os": "Windows",
    "os_version": "8",
    "resolution": "1920x1080"
  }//,
  //{
  // "browserName" : "android",
  // "os" : "android",
  // "device" : "Samsung Galaxy S III",
  // "deviceOrientation": "portrait"
  //}

];


if (process.env.BROWSER_STACK_USERNAME == null) {
  throw 'You need to set your BrowserStack username as BROWSER_STACK_USERNAME enviroment variable!';
}

if (process.env.BROWSER_STACK_ACCESS_KEY == null) {
  throw 'You need to set your BrowserStack access key as BROWSER_STACK_ACCESS_KEY enviroment variable!';
}



_.each(browsers, function(browser) {



  var browserString = browser.browserName || browser.browser+' '+(browser['browser_version'] || 'latest stable');
  var platformString = browser.device ? changeCase.titleCase(browser.os)+': '+browser.device : browser.os+' '+browser['os_version'];

  describe('Test browser: '+changeCase.titleCase(browserString)+' [ '+platformString+' ]', function() {

    describe('Github homepage', function(){

      var client;

      before(function(done){
        client = webdriverjs.remote({
          desiredCapabilities: browser,
          host: 'hub.browserstack.com',
          port: 80,
          user : process.env.BROWSER_STACK_USERNAME,
          key: process.env.BROWSER_STACK_ACCESS_KEY,
          logLevel: 'silent'
        });
        //screenshotHandler.setup('./screenshots');
        client.init(done);
      });

      after(function(done) {
        setTimeout(function(){
          client.end(done);
        }, 1000);
        //callback();
        //client.end(callback);
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
          //result.width.should.equal(89);
        })
        .call(done);
      });


    });

  });

});



