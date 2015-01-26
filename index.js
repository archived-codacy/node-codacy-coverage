(function (parser, reporter) {
    'use strict';
    module.exports = {
        getParser: parser.getParser,
        reporter: reporter
    };
}(require('./lib/coverageParser'), require('./lib/reporter')));