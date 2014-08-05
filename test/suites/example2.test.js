module.exports = function(client) {

  describe('Google homepage', function() {

    /*
     * Test #
     * ---------------------------------------------------------------------------
     * Opening the website is the slowest test as it means starting up the machine/browser as well
     */
    it('should open the website',function(done) {
      this.timeout(10000);
      client
      .url('https://google.com/')
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
        title.should.equal('Google');
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

  });

}
