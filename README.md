BrowserStack e2e starter with WebDriverIO & MochaJS
===================================================

*Work in progress*


Features
--------
Test either againt various browsers available at [BrowserStack](http://browserstack.com) or locally against PhantomJS. Uses [WebDriverIO](http://webdriver.io/) for communicating with Selenium/BrowserStack.


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

### BrowserStack config

```bash
export BROWSERSTACK_USERNAME=<your-browserstack-username>
export BROWSERSTACK_ACCESS_KEY=<your-secret-browserstack-access-key>
```

#### Local
```sh
mocha --reporter=spec
```

#### Continuous Integration
```sh
npm test
```
Which outputs the test results as "standard-ish" [XUnit XML](http://en.wikipedia.org/wiki/XUnit).

### PhantomJS

For testing against local headless PhantomJS browser you must have

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


Todo
----
- Separate test suites from setup code
- One file per test suite

