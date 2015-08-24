(function (request, Joi, Promise, util, logger) {
    'use strict';

    var optionsValidation = Joi.object({
        endpoint: Joi.string().min(1).optional().example('https://api.codacy.com/2.0/coverage/:commitId/:language')
    });
    var tokenValidation = Joi.string().required().min(1).example('1234567890');//TODO: Revisit this validation to see if we can better validate the values
    var commitIdValidation = Joi.string().required().min(1).example('1234567890'); //TODO: Revisit this validation to see if we can better validate the values
    var coverageDataValidation = Joi.object({
        total: Joi.number().integer().required().min(0).max(100),
        fileReports: Joi.array().required().items(Joi.object({
            filename: Joi.string().required().min(1),
            total: Joi.number().integer().required().min(0).max(100),
            coverage: Joi.object().pattern(/\d/, Joi.number().integer().min(1))
        }).required())
    }).example({total: 50, fileReports: [{filename: 'filename', total: 10, coverage: {1: 1, 2: 3}}]});

    module.exports = function (options) {
        logger.trace(util.format('Creating reporter for %j', options));
        var optionsValid = Joi.validate(options, optionsValidation, {
            stripUnknown: true
        });

        if (optionsValid.error) {
            logger.error(optionsValid.error);
            throw optionsValid.error;
        }

        var endpoint = options.endpoint || 'https://api.codacy.com/2.0/coverage/:commitId/javascript';
        logger.debug('Setting up reporter communicating to: ' + endpoint);

        return {
            sendCoverage: function sendCoverage(token, commitId, data) {
                return new Promise(function (resolve, reject) {
                    logger.trace(util.format('Sending Coverage for token [%s] and commitId [%s]', token, commitId));
                    var tokenValid = Joi.validate(token, tokenValidation);
                    var commitIdValid = Joi.validate(commitId, commitIdValidation);
                    var dataValid = Joi.validate(data, coverageDataValidation, {
                        stripUnknown: true
                    });
                    var validationErr = tokenValid.error || commitIdValid.error || dataValid.error;

                    if (validationErr) {
                        logger.error(validationErr);
                        return reject(validationErr);
                    }

                    var url = endpoint.replace(':commitId', commitId);
                    logger.trace(util.format('Sending POST to %s', url));

                    return request({
                        url: url,
                        method: 'POST',
                        json: data,
                        headers: {
                            // jscs:disable
                            'project_token': token
                            // jscs:enable
                        },
                        resolveWithFullResponse: true
                    }).then(function (res) {
                        if (res.statusCode !== 200) {
                            var err = new Error(util.format('Expected Status Code of 200, but got [%s]', res.statusCode));
                            logger.error(util.format('Status Code [%s] - Error [%j]', res.statusCode, res.error));
                            return reject(err);
                        }
                        logger.debug('Successfully sent coverage data');
                        resolve();
                    }, function (res) {
                        var err = new Error(util.format('Expected Successful Status Code, but got [%s]', res.statusCode));
                        logger.error(util.format('Status Code [%s] - Error [%j]', res.statusCode, res.error));
                        reject(err);
                    });
                });
            }
        };
    };
}(require('request-promise'), require('joi'), require('bluebird'), require('util'), require('./logger')()));
