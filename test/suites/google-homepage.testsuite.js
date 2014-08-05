/*
 * Example Test Suite 2
 * =============================================================================
 */
module.exports = function(client) {

  describe('Google homepage', function() {

    /*
     * Test # 1
     * -------------------------------------------------------------------------
     * Opening the website is the slowest test
     * as it means starting up the machine/browser as well
     */
    it('should open the website',function(done) {
      client
      .url('https://google.com/?hl=en')
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
        title.should.equal('Google');
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
    it('should have a search input field visible',function(done) {
      client
      .isVisible('input[name=q]', function(err, isItVisible){
        should.not.exist(err);
        isItVisible.should.be.true;
      })
      .call(done);
    });

    /*
     * Test # 5
     * -------------------------------------------------------------------------
     */
    it('should allow search',function(done) {
      client
      .setValue('input[name=q]', 'Cthulhu', function(err){
        should.not.exist(err);
        //isItVisible.should.be.true;
      })
      .click('[name="btnG"]')
      .pause(1000)
      .getTitle(function(err,title) {
          title.should.equal('Cthulhu - Google Search');
      })
      .call(done);
    });

  });

}
