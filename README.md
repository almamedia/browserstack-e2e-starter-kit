BrowserStack e2e starter
========================

Test either againt multiple browsers available at [BrowserStack](http://browserstack.com) or locally against PhantomJS. Uses [WebDriverIO](http://webdriver.io/) for communicating with Selenium/BrowserStack.

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
mocha --reporter=spec
```

### Running tests on Continuous Integration
```sh
npm test
```
This outputs the test results as "standard-ish" [XUnit XML](http://en.wikipedia.org/wiki/XUnit).


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
  HEADLESS_PHANTOM=true mocha --reporter=spec
  ```



Writing tests
-------------

TODO



Todo
----
- Separate test suites from setup code
- Separate browser configs to ext json file
- One file per test suite
- Optional screenshots on test fails
- Documentation about writing tests
- Better example test suites
