/*
 * Test suite for testing Google search functionality
 * =============================================================================
 */
module.exports = function(client) {

  describe('Google search', function() {

    /*
     * Test # 1
     * -------------------------------------------------------------------------
     * Opening the website is the slowest test
     * as it means starting up the machine/browser as well
     */
    it('should open the page',function(done) {
      client
      .url('https://google.com/?hl=en')
      .call(done);
    });

    /*
     * Test # 2
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
     * Test # 3
     * -------------------------------------------------------------------------
     */
    it('should open the search results page after submitting search form',function(done) {
      client
      .setValue('input[name=q]', 'Cthulhu', function(err){
        should.not.exist(err);
      })
      .submitForm('form[action="/search"]')
      .pause(1000)
      .click('[name="btnG"]')//google JS functionality requires "double" form send for page title to update
      .getTitle(function(err,title) {
        title.should.equal('Cthulhu - Google Search');
      })
      .call(done);
    });

  });

}
