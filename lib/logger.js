(function (logDriver) {
    'use strict';
    module.exports = function SetupLogger(options) {
        options = options || {};
        return logDriver({level: getLogLevel(options)});
    };

    function getLogLevel(options) {
        var logLevel = 'warn';

        if (options.verbose) {
            logLevel = 'debug';
        }

        if (options.debug) {
            logLevel = 'trace';
        }

        // Environment variables don't override options passed in.
        if (logLevel === 'warn') {
            if (process.env.CODACY_VERBOSE) {
                logLevel = 'debug';
            }

            if (process.env.CODACY_DEBUG) {
                logLevel = 'trace';
            }
        }
        return logLevel;
    }

}(require('log-driver')));