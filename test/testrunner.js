var webdriverjs = require('webdriverjs');
var os = require('os');
global['should'] = require('chai').should();

global['changeCase'] = require('change-case');
global['lodash'] = require('lodash');

var phantom = process.env.HEADLESS_PHANTOM || false;


var shell = require('shelljs');



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





lodash.each(browsers, function(browser) {

  var labelString = '';
  labelString += String(browser['browserName']).trim().toLowerCase() == 'ie' ? 'Internet Explorer' : changeCase.titleCase(browser['browserName']);
  labelString += browser['version'] ? ' ['+browser['version']+']' :' [latest stable version]';
  labelString += ' running in';
  labelString += ' '+changeCase.titleCase(browser['os']);
  labelString += browser['os_version'] ? ' '+browser['os_version'] : '';
  labelString += browser['device'] ? ' '+browser['device'] : '';
  labelString += browser['deviceOrientation'] ? ' '+browser['deviceOrientation'] : '';
  labelString += browser['resolution'] ? ' '+browser['resolution'] : '';

  describe(labelString, function(){

    // run tests inside here

  });

});

