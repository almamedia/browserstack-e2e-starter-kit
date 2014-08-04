var glob = require("glob");
var slugify = require('slugify');
var fs = require('fs');

module.exports = {

  setup: function(screenshotsFolder) {

    if(fs.existsSync(screenshotsFolder)) {

      glob.sync(screenshotsFolder+'error-screenshot-*.png').forEach(function(value, index, array) {
        fs.unlinkSync(value);
      });

    } else {

      fs.mkdirSync(screenshotsFolder);
    }

  },

  take: function(client, testTitle) {
    client.saveScreenshot(screenshotsFolder+'error-when-testing-'+changeCase.camelCase(slugify(testTitle))+'.png').end();
  }

}
