var webdriverjs = require('webdriverjs');
var os = require('os');

var changeCase = require('change-case');
var _ = require('lodash');

var phantom = process.env.HEADLESS_PHANTOM || false;


var shell = require('shelljs');


global.should = require('chai').should();




var homePageTest = require('./homepage.test.js');

var browsers = [];


if (phantom) {

  browsers = [
    {
      "browserName"   : "phantom",
      "version"       : String(shell.exec('phantomjs -v', {silent:true}).output).trim() || 'version unknown',
      "os"            : os.type()+' '+os.arch(),
      "os_version"    : os.release(),
      "resolution"    : "headless"
    },
  ]

} else {

  browsers = [
  //  {
  //    "browserName"   : "firefox",
  //    "os"            : "windows",
  //    "os_version"    : "XP",
  //    "resolution"    : "1024x768"
  //  },
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

}



if (!phantom && process.env.BROWSERSTACK_USERNAME == null) {
  throw 'You need to set your BrowserStack username as BROWSERSTACK_USERNAME enviroment variable!';
}

if (!phantom && process.env.BROWSERSTACK_ACCESS_KEY == null) {
  throw 'You need to set your BrowserStack access key as BROWSERSTACK_ACCESS_KEY enviroment variable!';
}





_.each(browsers, function(browser) {

  var labelString = '';
  labelString += String(browser['browserName']).trim().toLowerCase() == 'ie' ? 'Internet Explorer' : changeCase.titleCase(browser['browserName']);
  labelString += browser['version'] ? ' ['+browser['version']+']' :' [latest stable version]';
  labelString += ' running in';
  labelString += ' '+changeCase.titleCase(browser['os']);
  labelString += browser['os_version'] ? ' '+browser['os_version'] : '';
  labelString += browser['device'] ? ' '+browser['device'] : '';
  labelString += browser['deviceOrientation'] ? ' '+browser['deviceOrientation'] : '';
  labelString += browser['resolution'] ? ' '+browser['resolution'] : '';

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

  describe(labelString, function(){

    this.timeout(60*60*1000);

    before(function(){

      //screenshotHandler.setup('./screenshots');

      client.init();
    });

    // run tests inside here
    homePageTest(client, labelString);

    after(function(done) {
      client.end(done);
    });


//    afterEach(function(done) {
//
//      if(this.currentTest.state === 'failed') {
//        //screenshotHandler.take(client, this.currentTest.title);
//      }
//      done();
//    });


  });

});

