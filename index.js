(function (parser, reporter, getGitData) {
    'use strict';
    module.exports = {
        getParser: parser.getParser,
        reporter: reporter,
        getGitData: getGitData
    };
}(require('./lib/coverageParser'), require('./lib/reporter'), require('./lib/getGitData')));