(function (logDriver) {
    'use strict';
    module.exports = function SetupLogger(options) {
        return logDriver({level: getLogLevel(options)});
    };

    function getLogLevel(options) {
        var logLevel = 'error';

        if (options.verbose) {
            logLevel = 'debug';
        }

        if (options.debug) {
            logLevel = 'trace';
        }

        // Environment variables don't override options passed in.
        if (logLevel === 'error') {
            if (process.env.CODACY_VERBOSE) {
                logLevel = 'debug';
            }

            if (process.env.CODACY_DEBUG) {
                logLevel = 'debug';
            }
        }
        return logLevel;
    }

}(require('log-driver')));