(function (lcovParse, Q, Joi, logger) {
    'use strict';
    var lcovStringValidation = Joi.string(),
        optionsValidation = Joi.object().keys().optional();
    module.exports = {
        parse: function parseLcov(lcovString, options) {
            logger.debug('Parsing Lcov Data');
            var deferred = Q.defer();
            process.nextTick(function () {
                if (!lcovString) {
                    logger.error('Coverage data or file path required');
                    return deferred.reject(new Error('Coverage data or file path required'));
                }

                var validLcov = Joi.validate(lcovString, lcovStringValidation),
                    validOptions = Joi.validate(options, optionsValidation, {
                        stripUnknown: true
                    }),
                    validationError = validLcov.error || validOptions.error;

                if (validationError) {
                    logger.error(validationError);
                    return deferred.reject(validationError);
                }

                lcovParse(lcovString, function (err, data) {
                    if (err) {
                        logger.error(err);
                        return deferred.reject(err);
                    }

                    var result = {
                            total: 0,
                            fileReports: []
                        },
                        totalLines = 0,
                        totalHits = 0;

                    //TODO: Convert to reduce function
                    data.forEach(function (stats) {
                        var fileStats = {
                            filename: stats.file,
                            coverage: {}
                        };

                        if (stats.lines) {
                            totalLines += stats.lines.found;
                            totalHits += stats.lines.hit;

                            // The API uses integers only, so convert accordingly.
                            fileStats.total = Math.floor((stats.lines.hit / stats.lines.found) * 100);

                            //TODO: Convert to reduce function
                            stats.lines.details.forEach(function (detail) {
                                // If a line is not sent to the service then it is considered to be 0, so no need to be redundant in the payload.
                                // We also can't have a negative number of hits on a line, so exclude those.
                                if (detail.hit >= 1) {
                                    fileStats.coverage[detail.line] = detail.hit;
                                }
                            });
                        }

                        logger.trace('Successfully parsed ' + stats.file);
                        result.fileReports.push(fileStats);
                    });

                    // The API uses integers only, so convert accordingly.
                    result.total = Math.floor((totalHits / totalLines) * 100);

                    logger.debug('Successfully Parsed Lcov Data');

                    deferred.resolve(result);
                });
            });
            return deferred.promise;
        }
    };
}(require('lcov-parse'), require('q'), require('joi'), require('log-driver').logger));