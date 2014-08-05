describe('Github homepage', function() {

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
   * Opening the website is the slowest test as it means starting up the machine/browser as well
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
