BrowserStack e2e starter-kit
============================

|[**Installation**](#installation--config)|[**Running test**](#running-tests)| [**Configuring Browsers**](#configuring-browsers) | [**PhantomJS**](#phantomjs) |  [**Writing tests**](#writing-tests)  | [**FAQ**](#faq)  |  [**TODO**](#todo)  |
|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|



***

<br/>


[MochaJS](http://visionmedia.github.io/mocha) end-to-end tests against multiple browsers available at [BrowserStack](http://browserstack.com) or locally against [Selenium Standalone](http://selenium-release.storage.googleapis.com/index.html) & [PhantomJS](http://phantomjs.org/download.html). **This is a starter-kit which you can copy to your own projects.**

*Here's what running test suites looks like:*
![Example output](/example-output.png "Example output")





Installation & config
---------------------

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



Running tests
-------------

### Locally
```sh
npm test
```

### On Continuous Integration

Set an environment variable `export CI=true` (note: e.g. Travis-CI [sets this automatically](http://docs.travis-ci.com/user/ci-environment/#Environment-variables)) in your continuous integration environment or just prepend the variable before the test command:

```sh
CI=true npm test
```
This outputs the test results as "standard-ish" [XUnit XML](http://en.wikipedia.org/wiki/XUnit).



Configuring browsers
--------------------

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

Test suites must be stored in `./test/suites/`-folder. If you wish, you can also organize your test suites into folders (maximun 2 levels deep).

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

See the provided examples [`google-search.testsuite.js`](test/suites/google-search.testsuite.js) and [`github test suite`](test/suites/github/) for more examples.





FAQ
---
- **Why a simple test which just opens a website takes so long? Is my website slow?**

  No, your website is probably OK. Running a test against BrowserStack service means that when the test starts, BrowserStack has to start up a machine (or probably just a simulator) and open up a new browser before it gets to the part where the website starts to load. That's why the tests take some time.

- **Can I run these BrowserStack tests in parallel?**

  No you can't, at least without heavy refactor. Also by design [MochaJS](http://visionmedia.github.io/mocha) runs all the tests serially. You probably shouldn't be running end-to-end tests every minute, so the fact these tests take some time shouldn't be a problem. If you absolutely require parallel runs you should check out something like [this](https://github.com/browserstack/selenium-runner).


- **What's the motivation behind this?**

  I really like using [MochaJS](http://visionmedia.github.io/mocha) for all my testing (I have done unit testing and API testing with it before) and there wasn't (at least I had not found) any **good** examples of testing with Mocha against multiple browsers on BrowserStack. The huge amount of choice (and noise) related to Selenium testing is also a factor that really slowed me down at first. Then I found [webdriver.io](http://webdriver.io/) which looks really promising as it has nice API & syntax and by default uses [CSS-selectors](http://docs.webplatform.org/wiki/css/selectors) well-known by front-end developers (instead of XPath or some weird methods like `driver.findElement(webdriver.By.name('q'));` as does the Selenium's own webdriverjs project). This starter-kit was mainly developed for myself and my work, but hopefully it'll help others to get started with Mocha+BrowserStack as well!
  &mdash; [@aripalo](http://twitter.com/aripalo)


Todo
----
- Feature: Delete all cookies after each test suite run, see [issue #1](https://github.com/almamedia/browserstack-e2e-starter-kit/issues/1)
- Open source
