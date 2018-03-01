(function (parser, reporter, getGitData, logger, Promise, util) {
    'use strict';
    module.exports = function (input, opts) {
        opts = opts || {};

        var token = opts.token || process.env.CODACY_PROJECT_TOKEN || process.env.CODACY_REPO_TOKEN;
        var accountToken = opts.accountToken || process.env.CODACY_ACCOUNT_TOKEN;
        var username = opts.username;
        var projectName = opts.projectName;
        var commit = opts.commit;
        var format = opts.format || 'lcov';
        var pathPrefix = opts.prefix || '';
        var language = opts.language;
        var loggerImpl;

        loggerImpl = logger({
            verbose: opts.verbose,
            debug: opts.debug
        });

        if (!token && !accountToken) {
            return Promise.reject(new Error('Token is required'));
        }

        if (accountToken) {
            if (!username) {
                return Promise.reject(new Error('When using an account token, a username is required.'));
            }
            if (!projectName) {
                return Promise.reject(new Error('When using an account token, a project name is required.'));
            }
        }

        loggerImpl.info(util.format('Handling input for: token [%j], accountToken [%j], username [%j], projectName [%j], commitId [%j], language [%j], endpoint [%j], format [%j], path prefix [%j], verbose [%j], debug [%j]',
            token, accountToken, username, projectName, commit, language, opts.endpoint, format, pathPrefix, opts.verbose, opts.debug));

        // Parse the coverage data for the given format and retrieve the commit id if we don't have it.
        return Promise.all([parser.getParser(format).parse(pathPrefix, input), getGitData.getCommitId(commit)]).spread(function (parsedCoverage, commitId) {
            // Now that we've parse the coverage data to the correct format, send it to Codacy.
            loggerImpl.trace(parsedCoverage);
            loggerImpl.debug('Sending coverage');
            return reporter({
                endpoint: opts.endpoint,
                accountToken: accountToken
            }).sendCoverage(token, commitId, language, parsedCoverage, accountToken, username, projectName);
        });
    };
}(require('./coverageParser'), require('./reporter'), require('./getGitData'), require('./logger'), require('bluebird'), require('util')));
