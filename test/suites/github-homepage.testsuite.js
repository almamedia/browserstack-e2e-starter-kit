/*
 * Test suite for testing Github homepage
 * =============================================================================
 */
module.exports = function(client) {

  describe('Github homepage', function() {

    /*
     * Test # 1
     * -------------------------------------------------------------------------
     * Opening the website is the slowest test
     * as it means starting up the machine/browser as well
     */
    it('should open the website',function(done) {
      client
      .url('https://github.com/')
      .call(done);
    });


    /*
     * Test # 2
     * -------------------------------------------------------------------------
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
     * Test # 3
     * -------------------------------------------------------------------------
     */
    it('should have a visible <body>',function(done) {
      client
      .isVisible('body', function(err, isItVisible){
        should.not.exist(err);
        isItVisible.should.be.true;
      })
      .call(done);
    });


    /*
     * Test # 4
     * -------------------------------------------------------------------------
     */
    it('should have a properly sized logo',function(done) {
      client
      .getElementSize('.header-logo-wordmark', function(err, result) {
        should.not.exist(err);
        result.height.should.equal(32);
      })
      .call(done);
    });

  });

}
