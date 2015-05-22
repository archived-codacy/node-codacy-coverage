(function (parser, reporter, getGitData, handleInput) {
    'use strict';
    module.exports = {
        getParser: parser.getParser,
        reporter: reporter,
        getGitData: getGitData,
        handleInput: handleInput
    };
}(require('./lib/coverageParser'), require('./lib/reporter'), require('./lib/getGitData'), require('./lib/handleInput')));