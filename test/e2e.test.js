var webdriverjs = require('webdriverjs');
var os = require('os');
global['should'] = require('chai').should();

global['changeCase'] = require('change-case');
global['lodash'] = require('lodash');

var phantom = process.env.HEADLESS_PHANTOM || false;



var browsers = [];


if (phantom) {

  browsers = [
    {
      "browserName"   : "phantom",
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

    this.timeout(60*60*1000);

    var client = {};

    before(function(){

      //screenshotHandler.setup('./screenshots');

      if (phantom) {

        client = webdriverjs.remote({
          desiredCapabilities: {
            browserName: 'phantomjs'
          }
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

      client.init();
    });

    /*
     * Test #
     * ---------------------------------------------------------------------------
     */
    it('should open the website',function(done) {
      this.timeout(10000);
      client
      .url('https://github.com/')
      .call(done);
    });


    /*
     * Test #
     * ---------------------------------------------------------------------------
     */
    it('should have a title',function(done) {
      client
      .getTitle(function(err, title) {
        should.not.exist(err);
        title.should.equal('GitHub · Build software better, together.');
      })
      .call(done);
    });

    /*
     * Test #
     * ---------------------------------------------------------------------------
     */
    it('should containg a <body> tag',function(done) {
      client
      .getTagName('body', function(err, tagName){
        should.not.exist(err);
        tagName.should.equal('body');
      })
      .call(done);
    });


    /*
     * Test #
     * ---------------------------------------------------------------------------
     */
    it('should have a properly sized logo',function(done) {
      client
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

    afterEach(function(done) {

      if(this.currentTest.state === 'failed') {
        //screenshotHandler.take(client, this.currentTest.title);
      }
      done();

    });


  });

});

