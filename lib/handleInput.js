(function (parser, reporter, getGitData, logger, Promise) {
    'use strict';
    module.exports = function (input, opts) {
        opts = opts || {};

        var token = opts.token || process.env.CODACY_REPO_TOKEN,
            commitId = opts.commit,
            format = opts.format || 'lcov',
            pathPrefix = opts.prefix || '',
            loggerImpl;

        loggerImpl = logger({
            verbose: opts.verbose,
            debug: opts.debug
        });

        if (!token) {
            var err = new Error('Token is required');
            return Promise.reject(err);
        }

        // Parse the coverage data for the given format and retrieve the commit id if we don't have it.
        return Promise.all([parser.getParser(format).parse(pathPrefix, input), getGitData.getCommitId(commitId)]).spread(function (parsedCoverage, commitId) {
            // Now that we've parse the coverage data to the correct format, send it to Codacy.
            loggerImpl.trace(parsedCoverage);
            loggerImpl.debug('Sending coverage');
            return reporter({
                endpoint: opts.endpoint
            }).sendCoverage(token, commitId, parsedCoverage);
        });
    };
}(require('./coverageParser'), require('./reporter'), require('./getGitData'), require('./logger'), require('bluebird')));
