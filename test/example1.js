/*
 * Example test scenario
 * -----------------------------------------------------------------------------
 * - What's up with the "done": http://visionmedia.github.io/mocha/#asynchronous-code
 */
describe('Github homepage', function(){

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

