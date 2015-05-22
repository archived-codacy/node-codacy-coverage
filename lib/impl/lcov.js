(function (lcovParse, Promise, Joi, logger, util, path) {
    'use strict';

    var lcovStringValidation = Joi.string().required();
    var optionsValidation = Joi.object().keys().optional();

    module.exports = {
        parse: function parseLcov(pathPrefix, lcovString, options) {
            return new Promise(function (resolve, reject) {
                logger.debug('Parsing Lcov Data');
                var validLcov = Joi.validate(lcovString, lcovStringValidation);
                var validOptions = Joi.validate(options, optionsValidation, {
                    stripUnknown: true
                });
                var validationError = validLcov.error || validOptions.error;

                if (validationError) {
                    logger.error(validationError);
                    return reject(validationError);
                }

                lcovParse(lcovString, function (err, data) {
                    if (err) {
                        err = new Error(err);

                        logger.error(err);
                        return reject(err);
                    }

                    var result = {
                        total: 0,
                        fileReports: []
                    };
                    var totalLines = 0;
                    var totalHits = 0;

                    //TODO: Convert to reduce function
                    data.forEach(function (stats) {
                        var fileStats = {
                            // The API expects the filenames to be relative to the project, ex. lib/reporter.js
                            filename: stats.file ? pathPrefix + path.relative(process.cwd(), stats.file) : '',
                            coverage: {}
                        };

                        totalLines += stats.lines.found;
                        totalHits += stats.lines.hit;

                        // The API uses integers only, so convert accordingly.
                        fileStats.total = Math.floor(util.safeDivision(stats.lines.hit, stats.lines.found) * 100);

                        //TODO: Convert to reduce function
                        stats.lines.details.forEach(function (detail) {
                            // If a line is not sent to the service then it is considered to be 0, so no need to be redundant in the payload.
                            // We also can't have a negative number of hits on a line, so exclude those.
                            if (detail.hit >= 1) {
                                fileStats.coverage[detail.line] = detail.hit;
                            }
                        });

                        logger.trace('Successfully parsed ' + stats.file);
                        result.fileReports.push(fileStats);
                    });

                    // The API uses integers only, so convert accordingly.
                    result.total = Math.floor(util.safeDivision(totalHits, totalLines) * 100);

                    logger.debug('Successfully Parsed Lcov Data');

                    resolve(result);
                });
            });
        }
    };
}(require('lcov-parse'), require('bluebird'), require('joi'), require('../logger')(), require('../util'), require('path')));
