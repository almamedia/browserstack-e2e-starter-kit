var webdriverjs = require('webdriverjs');
var should = require('chai').should();

var changeCase = require('change-case');
var async = require('async');
var _ = require('lodash');

var browsers = [
  {
    "browserName"   : "firefox",
    "os"            : "windows",
    "os_version"    : "XP",
    "resolution"    : "1024x768"
  },
  {
    "browserName"   : "chrome",
    "os"            : "os x",
    "os_version"    : "Mavericks",
    "resolution"    : "1280x1024"
  },
  {
    "browserName"   : "IE",
    "os"            : "windows",
    "os_version"    : "8.1",
    "resolution"    : "1920x1080"
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

  var labelString = '';
  labelString += browser['browserName']=='Ie' ? 'Internet Explorer' : changeCase.titleCase(browser['browserName']);
  labelString += browser['version'] ? ' ['+browser['version']+']' :' [latest stable version]';
  labelString += ' running in';
  labelString += ' '+changeCase.titleCase(browser['os']);
  labelString += browser['os_version'] ? ' '+browser['os_version'] : '';
  labelString += browser['device'] ? ' '+browser['device'] : '';
  labelString += browser['deviceOrientation'] ? ' '+browser['deviceOrientation'] : '';
  labelString += browser['resolution'] ? ' '+browser['resolution'] : '';

  describe(labelString, function(){

    this.timeout(99999999);
    var client = {};

    before(function(){

      client = webdriverjs.remote({
        desiredCapabilities: browser,
        host: 'hub.browserstack.com',
        port: 80,
        user : process.env.BROWSER_STACK_USERNAME,
        key: process.env.BROWSER_STACK_ACCESS_KEY,
        logLevel: 'silent'//change to 'verbose' if having problems...
      });
      //client = webdriverjs.remote({
      //  desiredCapabilities: {
      //    browserName: 'phantomjs'
      //  }
      //});

      client.init();
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

    after(function(done) {
      client.end(function(){
        setTimeout(done, 1000);
      });
    });
  });

});


/*
before(function(done){
  screenshotHandler.setup('./screenshots');
  client.init(done);
});

beforeEach(function(done) {
  this.timeout = timeoutInMillis;
  done();

});


after(function(done) {
  client.end(done);
});

afterEach(function(done) {

  if(this.currentTest.state === 'failed') {
    screenshotHandler.take(client, this.currentTest.title);
  }
  done();

});
*/
