BrowserStack e2e starter
========================

[MochaJS](http://visionmedia.github.io/mocha) end-to-end tests against multiple browsers available at [BrowserStack](http://browserstack.com) or locally against [Selenium Standalone](http://selenium-release.storage.googleapis.com/index.html) & [PhantomJS](http://phantomjs.org/download.html).

![Example output](/example-output.png "Example output")



Has still some [**TODOs**](#todo)!



Installation & usage
--------------------

- Requires [NodeJS](http://nodejs.org/) `v0.10` or newer

- Install [MochaJS](http://visionmedia.github.io/mocha) globally:

  ```sh
  sudo npm install -g mocha
  ```

- Then install local depedencies

  ```sh
  npm install
  ```

- Configure your BrowserStack username and access key:

  ```bash
  export BROWSERSTACK_USERNAME=<your-browserstack-username>
  export BROWSERSTACK_ACCESS_KEY=<your-secret-browserstack-access-key>
  ```

### Running tests locally
```sh
mocha
```

### Running tests on Continuous Integration
```sh
npm test
```
This outputs the test results as "standard-ish" [XUnit XML](http://en.wikipedia.org/wiki/XUnit).


### Configuring browsers

Browsers (together with operating system versin and screen resolution) are configured in [`./test/browsers.json`](test/browsers.json). See BrowserStack [capabilities](https://www.browserstack.com/automate/capabilities) and the list of available [browsers & mobile devices for Selenium testing](https://www.browserstack.com/list-of-browsers-and-platforms?product=automate).


PhantomJS
---------

For testing against local headless PhantomJS browser (without using BrowserStack) you must:

- Install [PhantomJS](http://phantomjs.org/download.html)

- Download [Selenium Standalone](http://selenium-release.storage.googleapis.com/index.html)

- Run the Selenium Standalone server:

  ```sh
  java -jar selenium-server-standalone-2.42.1.jar
  ```

- Run the tests with:

  ```sh
  HEADLESS_PHANTOM=true mocha
  ```



Writing tests
-------------

Test suites must be stored in `./test/suites/`-folder.

A test suite must exposed as CommonJS module function which takes the ([webdriver.io](http://webdriver.io/)) `client` as an argument. Suite must have at least one MochaJS `describe`-block inside them.

Here's an example structure:

```js
module.exports = function(client) {

  describe('Describe your test suite here', function() {
    it('should do something', function(done) {
      /* some tests */
    });
  });

}
```

See the provided examples [`github-homepage.testsuite.js`](test/suites/github-homepage.testsuite.js) and [`google-search.testsuite.js`](test/suites/google-search.testsuite.js) for more examples.



Todo
----
- Optional screenshots on test fails
- Ability to organize suites into subfolders
- Open source
