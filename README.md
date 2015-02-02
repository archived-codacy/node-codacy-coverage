# Codacy
[Codacy](https://codacy.com/) support for Node.js. Get coverage reporting and code analysis for Node.js from Codacy.

[![Build Status](https://travis-ci.org/codacy/node-codacy-reporter.svg?branch=1.0.0)](https://travis-ci.org/codacy/node-codacy-reporter)
[![npm](https://img.shields.io/npm/v/codacy.svg)](https://www.npmjs.com/package/codacy)
[![npm](https://img.shields.io/npm/dm/codacy.svg)](https://www.npmjs.com/package/codacy)
[![Codacy](https://www.codacy.com/project/badge/d1bfdf020cc044bb8a2020d009378733)](https://www.codacy.com/public/davidtpate/codacy)
[![David](https://img.shields.io/david/codacy/node-codacy-reporter.svg)](https://david-dm.org/codacy/node-codacy-reporter)
[![David](https://img.shields.io/david/dev/codacy/node-codacy-reporter.svg)](https://david-dm.org/codacy/node-codacy-reporter)
[![David](https://img.shields.io/david/peer/codacy/node-codacy-reporter.svg)](https://david-dm.org/codacy/node-codacy-reporter)

##Installation:
Add the latest version of `codacy` to your package.json:
```
npm install codacy --save
```

If you're using mocha, add `mocha-lcov-reporter` to your package.json:
```
npm install mocha-lcov-reporter --save
```

##Usage:

This script ( `bin/codacy.js` ) can take standard input from any tool that emits the lcov data format (including [mocha](http://visionmedia.github.com/mocha/)'s [LCov reporter](https://npmjs.org/package/mocha-lcov-reporter)) and send it to Codacy to report your code coverage there.

Once your app is instrumented for coverage, and building, you need to pipe the lcov output to `./node_modules/codacy/bin/codacy.js`.

You'll need to provide the Report token from Codacy via an environment variable:
* CODACY_REPO_TOKEN (the secret repo token from Codacy.com)

### [Mocha](http://visionmedia.github.io/mocha/) + [Blanket.js](https://github.com/alex-seville/blanket)
- Install [blanket.js](http://blanketjs.org/)
- Configure blanket according to [docs](https://github.com/alex-seville/blanket/blob/master/docs/getting_started_node.md).
- Run your tests with a command like this:

```sh
NODE_ENV=test YOURPACKAGE_COVERAGE=1 ./node_modules/.bin/mocha \
  --require blanket \
  --reporter mocha-lcov-reporter |  ./node_modules/codacy/bin/codacy.js
```
### [Mocha](http://visionmedia.github.io/mocha/) + [JSCoverage](https://github.com/fishbar/jscoverage)

Instrumenting your app for coverage is probably harder than it needs to be (read [here](http://www.seejohncode.com/2012/03/13/setting-up-mocha-jscoverage/)), but that's also a necessary step.

In mocha, if you've got your code instrumented for coverage, the command for a travis build would look something like this:
```sh
YOURPACKAGE_COVERAGE=1 ./node_modules/.bin/mocha test -R mocha-lcov-reporter | ./node_modules/codacy/bin/codacy.js
```
### [Istanbul](https://github.com/gotwarlost/istanbul)

**With Mocha:**

```sh
istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/codacy/bin/codacy.js && rm -rf ./coverage
```

**With Jasmine:**

```sh
istanbul cover jasmine-node --captureExceptions spec/ && cat ./coverage/lcov.info | ./node_modules/codacy/bin/codacy.js && rm -rf ./coverage
```

### [Poncho](https://github.com/deepsweet/poncho)
Client-side JS code coverage using [PhantomJS](https://github.com/ariya/phantomjs), [Mocha](https://github.com/visionmedia/mocha) and [Blanket](https://github.com/alex-seville/blanket):
- [Configure](http://visionmedia.github.io/mocha/#browser-support) Mocha for browser
- [Mark](https://github.com/deepsweet/poncho#usage) target script(s) with `data-cover` html-attribute
- Run your tests with a command like this:

```sh
./node_modules/.bin/poncho -R lcov test/test.html | ./node_modules/codacy/bin/codacy.js
```

## License
[MIT](LICENSE)
