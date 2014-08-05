/*
 * Test suite for testing Github homepage
 * =============================================================================
 */
module.exports = function(client) {

  describe('Github Help', function() {

    /*
     * Test # 1
     * -------------------------------------------------------------------------
     * Opening the website is the slowest test
     * as it means starting up the machine/browser as well
     */
    it('should open the page',function(done) {
      client
      .url('https://help.github.com/')
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
        title.should.equal('GitHub Help');
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

  });

}
