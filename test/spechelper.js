/*
 * Require modules and do some setup
 * -----------------------------------------------------------------------------
 */
var path = require('path');
var changeCase = require('change-case');
var should = require('chai').should();
var webdriverjs = require('webdriverjs');
var screenshotHandler = require('./lib/screenshot-handler.js');

global.should = should;

global.client = webdriverjs.remote({
  desiredCapabilities: {
    browserName: 'phantomjs'
  }
});

var timeoutInSeconds = 60;//in seconds
var timeoutInMillis = timeoutInSeconds * 1000;







//if (process.env.BROWSER_STACK_USERNAME == null) {
//  throw 'You need to set your BrowserStack username as BROWSER_STACK_USERNAME enviroment variable!';
//}
//
//if (process.env.BROWSER_STACK_ACCESS_KEY == null) {
//  throw 'You need to set your BrowserStack access key as BROWSER_STACK_ACCESS_KEY enviroment variable!';
//}



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
