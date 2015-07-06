(function (parser, reporter, getGitData, logger, Promise, util) {
    'use strict';
    module.exports = function (input, opts) {
        opts = opts || {};

        var token = opts.token || process.env.CODACY_PROJECT_TOKEN || process.env.CODACY_REPO_TOKEN;
        var commit = opts.commit;
        var format = opts.format || 'lcov';
        var pathPrefix = opts.prefix || '';
        var loggerImpl;

        loggerImpl = logger({
            verbose: opts.verbose,
            debug: opts.debug
        });

        if (!token) {
            return Promise.reject(new Error('Token is required'));
        }

        loggerImpl.info(util.format('Handling input for: token [%j], commitId [%j], endpoint [%j], format [%j], path prefix [%j], verbose [%j], debug [%j]',
            token, commit, opts.endpoint, format, pathPrefix, opts.verbose, opts.debug));

        // Parse the coverage data for the given format and retrieve the commit id if we don't have it.
        return Promise.all([parser.getParser(format).parse(pathPrefix, input), getGitData.getCommitId(commit)]).spread(function (parsedCoverage, commitId) {
            // Now that we've parse the coverage data to the correct format, send it to Codacy.
            loggerImpl.trace(parsedCoverage);
            loggerImpl.debug('Sending coverage');
            return reporter({
                endpoint: opts.endpoint
            }).sendCoverage(token, commitId, parsedCoverage);
        });
    };
}(require('./coverageParser'), require('./reporter'), require('./getGitData'), require('./logger'), require('bluebird'), require('util')));
