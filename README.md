BrowserStack e2e starter with WebDriverIO & MochaJS
===================================================

*Work in progress*


Features
--------
Test either locally against PhantomJS (or any local browser) or againt various browsers available at [BrowserStack](http://browserstack.com).


Requirements
------------
- PhantomJS and Selenium Standalone for local testing
- BrowserStack username and access key for BrowserStack testing


Installation
------------
`npm install`

Usage
-----
To test againt PhantomJS:
`mocha index.js --reporter spec`

To test against BrowserStack:
`mocha index.js --browser=./browsers/chrome.json --reporter spec`



Todo
----
- Separate test suites from setup code
- One file per test suite
