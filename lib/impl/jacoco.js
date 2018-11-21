(function (jacocoParse, Promise, Joi, logger, util, path) {
    'use strict';

    var jacocoStringValidation = Joi.string().required();
    var optionsValidation = Joi.object().keys().optional();

    module.exports = {
        parse: function parseJacoco(pathPrefix, jacocoString, options) {
            return new Promise(function (resolve, reject) {
                logger.debug('Parsing Jacoco Data');
                var nonEmptyReport = Joi.validate(jacocoString, jacocoStringValidation);
                var validOptions = Joi.validate(options, optionsValidation, {
                    stripUnknown: true
                });
                var validationError = nonEmptyReport.error || validOptions.error;

                if (validationError) {
                    logger.error(validationError);
                    return reject(validationError);
                }

                jacocoParse.parseContent(jacocoString, function (err, data) {
                    if (err) {
                        err = new Error('Failed to parse jacoco report: ' + err);

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
                            // Codacy needs the 0s to know failed coverage data
                            // We also can't have a negative number of hits on a line, so exclude those.
                            if (detail.hit >= 0) {
                                fileStats.coverage[detail.line] = detail.hit;
                            }
                        });

                        logger.trace('Successfully parsed ' + stats.file);
                        result.fileReports.push(fileStats);
                    });

                    // The API uses integers only, so convert accordingly.
                    result.total = Math.floor(util.safeDivision(totalHits, totalLines) * 100);

                    logger.debug('Successfully Parsed Jacoco Data');

                    resolve(result);
                });
            });
        }
    };
}(require('jacoco-parse'), require('bluebird'), require('joi'), require('../logger')(), require('../util'), require('path')));
