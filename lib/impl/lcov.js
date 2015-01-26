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
                    return deferred.reject(new Error('Coverage data required'));
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

                            fileStats.total = Math.floor((stats.lines.hit / stats.lines.found) * 100);

                            //TODO: Convert to reduce function
                            stats.lines.details.forEach(function (detail) {
                                fileStats.coverage[detail.line] = detail.hit;
                            });
                        }

                        result.fileReports.push(fileStats);
                    });

                    result.total = Math.floor((totalHits / totalLines) * 100);

                    deferred.resolve(result);
                });
            });
            return deferred.promise;
        }
    };
}(require('lcov-parse'), require('q'), require('joi'), require('log-driver').logger));