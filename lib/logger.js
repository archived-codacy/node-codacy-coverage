(function (logDriver) {
    'use strict';
    var logger;

    module.exports = function SetupLogger(options) {
        if (options || !logger) {
            options = options || {};

            logger = logDriver({level: getLogLevel(options)});
            return logger;
        } else {
            return logDriver.logger;
        }
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
