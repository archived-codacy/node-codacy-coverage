(function (parser, reporter) {
    module.exports = {
        getParser: parser.getParser,
        reporter: reporter
    };
}(require('./lib/coverageParser'), require('./lib/reporter')));