# Node Codacy Coverage
Credits to [David](https://github.com/DavidTPate) for creating this!
[Codacy](https://codacy.com/) support for Node.js. Get coverage reporting and code analysis for Node.js from Codacy.


[![Build Status](https://circleci.com/gh/codacy/node-codacy-coverage.png?style=shield&circle-token=:circle-token)](https://circleci.com/gh/codacy/node-codacy-coverage)
[![npm](https://img.shields.io/npm/v/codacy-coverage.svg)](https://www.npmjs.com/package/codacy-coverage)
[![npm](https://img.shields.io/npm/dm/codacy-coverage.svg)](https://www.npmjs.com/package/codacy-coverage)
[![Codacy](https://api.codacy.com/project/badge/grade/3c7f5de6ce734762981d3e689de7b941)](https://www.codacy.com/app/codacy/node-codacy-coverage)
[![Codacy](https://api.codacy.com/project/badge/coverage/3c7f5de6ce734762981d3e689de7b941)](https://www.codacy.com/app/codacy/node-codacy-coverage)
[![David](https://img.shields.io/david/codacy/node-codacy-coverage.svg)](https://david-dm.org/codacy/node-codacy-coverage)
[![David](https://img.shields.io/david/dev/codacy/node-codacy-coverage.svg)](https://david-dm.org/codacy/node-codacy-coverage)
[![David](https://img.shields.io/david/peer/codacy/node-codacy-coverage.svg)](https://david-dm.org/codacy/node-codacy-coverage)

##Installation:
Add the latest version of `codacy-coverage` to your package.json:
```
npm install codacy-coverage --save
```

If you're using mocha, add `mocha-lcov-reporter` to your package.json:
```
npm install mocha-lcov-reporter --save
```

##Usage:

This script ( `bin/codacy-coverage.js` ) can take standard input from any tool that emits the lcov data format (including [mocha](http://mochajs.org)'s [LCov reporter](https://npmjs.org/package/mocha-lcov-reporter)) and send it to Codacy to report your code coverage there.

Once your app is instrumented for coverage, and building, you need to pipe the lcov output to `./node_modules/.bin/codacy-coverage`.

You'll need to provide the Report token from Codacy via an environment variable:
* CODACY_PROJECT_TOKEN (the secret repo token from Codacy.com)

> Note: You should keep your API token well **protected**, as it grants owner permissions to your projects.

**Enterprise**

To send coverage in the enterprise version you should:
```
export CODACY_API_BASE_URL=<Codacy_instance_URL>:16006
```

### [Mocha](http://mochajs.org) + [Blanket.js](https://github.com/alex-seville/blanket)
- Install [blanket.js](http://blanketjs.org/)
- Configure blanket according to [docs](https://github.com/alex-seville/blanket/blob/master/docs/getting_started_node.md).
- Run your tests with a command like this:

```sh
NODE_ENV=test YOURPACKAGE_COVERAGE=1 ./node_modules/.bin/mocha \
  --require blanket \
  --reporter mocha-lcov-reporter | ./node_modules/.bin/codacy-coverage
```
### [Mocha](http://mochajs.org) + [JSCoverage](https://github.com/fishbar/jscoverage)

Instrumenting your app for coverage is probably harder than it needs to be (read [here](http://www.seejohncode.com/2012/03/13/setting-up-mocha-jscoverage/)), but that's also a necessary step.

In mocha, if you've got your code instrumented for coverage, the command for a travis build would look something like this:
```sh
YOURPACKAGE_COVERAGE=1 ./node_modules/.bin/mocha test -R mocha-lcov-reporter | ./node_modules/.bin/codacy-coverage
```
### [Istanbul](https://github.com/gotwarlost/istanbul)

**With Mocha:**

```sh
istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/.bin/codacy-coverage && rm -rf ./coverage
```

**With Jasmine:**

```sh
istanbul cover jasmine-node --captureExceptions spec/ && cat ./coverage/lcov.info | ./node_modules/.bin/codacy-coverage && rm -rf ./coverage
```

### [Grunt](http://gruntjs.com/)
- Install & Configure [grunt-codacy](https://www.npmjs.com/package/grunt-codacy)

### [Poncho](https://github.com/deepsweet/poncho)
Client-side JS code coverage using [PhantomJS](https://github.com/ariya/phantomjs), [Mocha](http://mochajs.org) and [Blanket](https://github.com/alex-seville/blanket):
- [Configure](http://mochajs.org#browser-support) Mocha for browser
- [Mark](https://github.com/deepsweet/poncho#usage) target script(s) with `data-cover` html-attribute
- Run your tests with a command like this:

```sh
./node_modules/.bin/poncho -R lcov test/test.html | ./node_modules/.bin/codacy-coverage
```

### [gulp](http://gulpjs.com/)
- Install & Configure [gulp-codacy](https://www.npmjs.com/package/gulp-codacy)

### Troubleshooting

The paths in your coverage file should be relative, if you are having problems with absolute paths, you can run our plugin with `-p .` to strip the current path from the paths in your coverage file:
```
cat ./coverage/lcov.info | node_modules/.bin/codacy-coverage -p .
```

## License
[MIT](LICENSE)

## What is Codacy?

[Codacy](https://www.codacy.com/) is an Automated Code Review Tool that monitors your technical debt, helps you improve your code quality, teaches best practices to your developers, and helps you save time in Code Reviews.

### Among Codacy’s features:

 - Identify new Static Analysis issues
 - Commit and Pull Request Analysis with GitHub, BitBucket/Stash, GitLab (and also direct git repositories)
 - Auto-comments on Commits and Pull Requests
 - Integrations with Slack, HipChat, Jira, YouTrack
 - Track issues Code Style, Security, Error Proneness, Performance, Unused Code and other categories

Codacy also helps keep track of Code Coverage, Code Duplication, and Code Complexity.

Codacy supports PHP, Python, Ruby, Java, JavaScript, and Scala, among others.

### Free for Open Source

Codacy is free for Open Source projects.
