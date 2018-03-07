# Node Codacy Coverage

Credits to [David](https://github.com/DavidTPate) for creating this!
[Codacy](https://codacy.com/) support for Node.js. Get coverage reporting and code analysis for Node.js from Codacy.

[![Codacy](https://api.codacy.com/project/badge/grade/3c7f5de6ce734762981d3e689de7b941)](https://www.codacy.com/app/codacy/node-codacy-coverage)
[![Codacy](https://api.codacy.com/project/badge/coverage/3c7f5de6ce734762981d3e689de7b941)](https://www.codacy.com/app/codacy/node-codacy-coverage)
[![Build Status](https://circleci.com/gh/codacy/node-codacy-coverage.png?style=shield&circle-token=:circle-token)](https://circleci.com/gh/codacy/node-codacy-coverage)
[![npm](https://img.shields.io/npm/v/codacy-coverage.svg)](https://www.npmjs.com/package/codacy-coverage)
[![npm](https://img.shields.io/npm/dm/codacy-coverage.svg)](https://www.npmjs.com/package/codacy-coverage)
[![David](https://img.shields.io/david/codacy/node-codacy-coverage.svg)](https://david-dm.org/codacy/node-codacy-coverage)
[![David](https://img.shields.io/david/dev/codacy/node-codacy-coverage.svg)](https://david-dm.org/codacy/node-codacy-coverage)
[![David](https://img.shields.io/david/peer/codacy/node-codacy-coverage.svg)](https://david-dm.org/codacy/node-codacy-coverage)

## Installation

Add the latest version of `codacy-coverage` to your package.json:

```sh
npm install codacy-coverage --save
```

If you're using mocha, add `mocha-lcov-reporter` to your package.json:

```sh
npm install mocha-lcov-reporter --save
```

## Enterprise

To send coverage in the enterprise version you should specify your Codacy installation URL with the option `-e`:

```sh
codacy-coverage -e <YOUR-CODACY-ENTERPRISE-URL>:16006
```

## Usage

This cli can take standard input from any tool that emits the lcov data format (including [mocha](http://mochajs.org)'s [LCov reporter](https://npmjs.org/package/mocha-lcov-reporter)) and send it to Codacy to report your code coverage there.

Once your app is instrumented for coverage, and building, you need to pipe the lcov output to `codacy-coverage`.

### Identifying the project

You'll need to provide the secret Project API token from `Codacy Project > Settings > Integrations > Project API` via:

* (Recommended) Environment variable: CODACY_PROJECT_TOKEN
* CLI parameter variable: `--token`

> Note: You should keep your any API token well **protected**, as it grants owner permissions to your projects.

### Test Coverage

#### [Mocha](http://mochajs.org) + [Blanket.js](https://github.com/alex-seville/blanket)

* Install [blanket.js](http://blanketjs.org/)
* Configure blanket according to [docs](https://github.com/alex-seville/blanket/blob/master/docs/getting_started_node.md).
* Add test with coverage step to your package.json:

```json
"scripts": {
  "test-with-coverage": "NODE_ENV=test YOURPACKAGE_COVERAGE=1 mocha --require blanket --reporter mocha-lcov-reporter | codacy-coverage"
}
```

* Run your tests with:

```sh
npm run test-with-coverage
```

#### [Mocha](http://mochajs.org) + [JSCoverage](https://github.com/fishbar/jscoverage)

Instrumenting your app for coverage is probably harder than it needs to be (read [here](http://www.seejohncode.com/2012/03/13/setting-up-mocha-jscoverage/)), but that's also a necessary step.

* Add test with coverage step to your package.json:

```json
"scripts": {
  "test-with-coverage": "YOURPACKAGE_COVERAGE=1 mocha test -R mocha-lcov-reporter | codacy-coverage"
}
```

* Run your tests with:

```sh
npm run test-with-coverage
```

#### [Istanbul](https://github.com/gotwarlost/istanbul)

##### With Mocha

* Add test with coverage step to your package.json:

```json
"scripts": {
  "test-with-coverage": "istanbul cover _mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | codacy-coverage && rm -rf ./coverage"
}
```

* Run your tests with:

```sh
npm run test-with-coverage
```

##### With Jasmine

* Add test with coverage step to your package.json:

```json
"scripts": {
  "test-with-coverage": "istanbul cover jasmine-node --captureExceptions spec/ && cat ./coverage/lcov.info | codacy-coverage && rm -rf ./coverage"
}
```

* Run your tests with:

```sh
npm run test-with-coverage
```

#### [Poncho](https://github.com/deepsweet/poncho)

Client-side JS code coverage using [PhantomJS](https://github.com/ariya/phantomjs), [Mocha](http://mochajs.org) and [Blanket](https://github.com/alex-seville/blanket):

* [Configure](http://mochajs.org#browser-support) Mocha for browser
* [Mark](https://github.com/deepsweet/poncho#usage) target script(s) with `data-cover` html-attribute
* Add test with coverage step to your package.json:

```json
"scripts": {
  "test-with-coverage": "poncho -R lcov test/test.html | codacy-coverage"
}
```

* Run your tests with:

```sh
npm run test-with-coverage
```

#### [Jest](https://facebook.github.io/jest/)

* Add test with coverage step to your package.json:

```json
"scripts": {
  "test-with-coverage": "jest --coverage && cat ./coverage/lcov.info | codacy-coverage"
}
```

* Run your tests with:

```sh
npm run test-with-coverage
```

## Extras

### Account Token

As an alternative to the Project API token you can also send coverage using your account/api token by following steps:

* Add test with coverage step to your package.json:

```json
"scripts": {
  "test-with-coverage": "cat ./coverage/lcov.info | codacy-coverage --accountToken <account-token> --username <username> --projectName <project-name>"
}
```

* Run your tests with:

```sh
npm run test-with-coverage
```

You'll need to provide the secret Account API token from [Codacy Account](https://app.codacy.com/account/apiTokens)` > API Tokens` via:

* (Recommended) Environment variable: CODACY_ACCOUNT_TOKEN
* CLI parameter variable: `--accountToken`

### Force custom language (e.g. Typescript, Coffeescript, C, ...)

* Pass an extra parameter to the codacy-coverage reporter `--language typescript` or `--language coffeescript`.
* If you have multiple languages you need to invoke the reporter for each of them.

## Troubleshooting

### Path Problems

The paths in your coverage file should be relative,
if you are having problems with absolute paths,
you can run our plugin with `-p .` to strip the current path from the paths in your coverage file:

```json
"scripts": {
  "test-with-coverage": "cat ./coverage/lcov.info | codacy-coverage -p ."
}
```

### Enterprise Coverage

To send coverage in the **enterprise** version you should specify your Codacy installation URL followed by the port 16006 using the -e option, example:

```json
"scripts": {
  "test-with-coverage": "cat ./coverage/lcov.info | codacy-coverage -e <YOUR-CODACY-ENTERPRISE-URL>:16006"
}
```

## License

[MIT](LICENSE)

## What is Codacy

[Codacy](https://www.codacy.com/) is an Automated Code Review Tool that monitors your technical debt,
helps you improve your code quality,
teaches best practices to your developers,
and helps you save time in Code Reviews.

### Among Codacy’s features

* Identify new Static Analysis issues
* Commit and Pull Request Analysis with GitHub, BitBucket/Stash, GitLab (and also direct git repositories)
* Auto-comments on Commits and Pull Requests
* Integrations with Slack, HipChat, Jira, YouTrack
* Track issues Code Style, Security, Error Proneness, Performance, Unused Code and other categories

Codacy also helps keep track of Code Coverage, Code Duplication, and Code Complexity.

Codacy supports PHP, Python, Ruby, Java, JavaScript, and Scala, among others.

### Free for Open Source

Codacy is free for Open Source projects.
