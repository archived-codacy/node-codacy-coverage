(function(request, Joi, Promise, util, lodash, logger) {
    'use strict';

    var optionsValidation = Joi.object({
        endpoint: Joi.string().min(1).optional().example('https://api.codacy.com/2.0/coverage/:commitId/:language')
    });
    var tokenValidation = Joi.string().required().min(1).example('1234567890');//TODO: Revisit this validation to see if we can better validate the values
    var commitIdValidation = Joi.string().required().min(1).example('1234567890'); //TODO: Revisit this validation to see if we can better validate the values
    var accountTokenValidation = Joi.string().required().min(1).example('1234567890');
    var usernameValidation = Joi.string().required().min(1).example('1234567890');
    var projectNameValidation = Joi.string().required().min(1).example('1234567890');
    var coverageDataValidation = Joi.object({
        total: Joi.number().integer().required().min(0).max(100),
        fileReports: Joi.array().required().items(Joi.object({
            filename: Joi.string().required().min(1),
            total: Joi.number().integer().required().min(0).max(100),
            coverage: Joi.object().pattern(/\d/, Joi.number().integer().min(0))
        }).required())
    }).example({total: 50, fileReports: [{filename: 'filename', total: 10, coverage: {1: 1, 2: 3}}]});

    var languageMap = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        coffee: 'coffeescript'
    };

    function sendByLanguage(endpoint, commitId, token, data, accountToken, username, projectName) {
        var reportsByLanguage = lodash.groupBy(data.fileReports, function(elem) {
            return languageMap[lodash.head(lodash.takeRight(elem.filename.split('.'), 1))] || 'javascript';
        });

        var languageResponses = lodash.map(reportsByLanguage, function(fileReports, language) {

            var weighedCoverage = lodash.reduce(fileReports, function(accom, elem) {
                return accom + (elem.total * Object.keys(elem.coverage).length);
            }, 0);

            var coveredLines = lodash.reduce(fileReports, function(accom, elem) {
                return accom + Object.keys(elem.coverage).length;
            }, 0);

            var finalCoverage = weighedCoverage / coveredLines;

            var dataPerLanguage = lodash.clone(data);
            dataPerLanguage.fileReports = fileReports;
            dataPerLanguage.total = Math.floor(finalCoverage);

            return sendLanguage(endpoint, commitId, language, token, dataPerLanguage, accountToken, username, projectName);
        });

        return Promise.all(languageResponses)
            .then(function(errs) {
                errs = lodash.filter(errs, function(e) {
                    return !lodash.isUndefined(e)
                });

                if (errs.length) {
                    return Promise.reject(errs[0]);
                }

                logger.trace('All languages sent successfully');
                return Promise.resolve();
            }, function(err) {
                logger.trace('Failed to send some languages');
                return Promise.reject(err);
            });
    }


    function sendForLanguage(endpoint, commitId, language, token, data, accountToken, username, projectName) {
        return sendLanguage(endpoint, commitId, language, token, data, accountToken, username, projectName)
            .then(function(err) {
                if (err) {
                    return Promise.reject(err);
                }
                return Promise.resolve();
            }, function(err) {
                return Promise.reject(err);
            });
    }

    function sendLanguage(endpoint, commitId, language, token, data, accountToken, username, projectName) {
        var url = endpoint.replace(':commitId', commitId).replace(':language', language);
        // jscs:disable
        var headers = accountToken ? {api_token: accountToken} : {project_token: token};
        // jscs:enable
        if (accountToken) {
            url = url.replace(':username', username).replace(':projectName', projectName);
        }

        logger.trace(util.format('Sending POST to %s', url));
        return request({
            url: url,
            method: 'POST',
            json: data,
            headers: headers,
            resolveWithFullResponse: true
        }).then(function(res) {
            if (res.statusCode !== 200) {
                var err = new Error(util.format('Expected Status Code of 200, but got [%s]', res.statusCode));
                logger.error(util.format('Status Code [%s] - Error [%j]', res.statusCode, res.error));
                return Promise.reject(err);
            }
            logger.debug('Successfully sent coverage data');
            return Promise.resolve();
        }, function(res) {
            var err = new Error(util.format('Expected Successful Status Code, but got [%s]', res.statusCode));
            logger.error(util.format('Status Code [%s] - Error [%j]', res.statusCode, res.error));
            return Promise.reject(err);
        });
    }

    module.exports = function(options) {
        logger.trace(util.format('Creating reporter for %j', options));
        var optionsValid = Joi.validate(options, optionsValidation, {
            stripUnknown: true
        });

        if (optionsValid.error) {
            logger.error(optionsValid.error);
            throw optionsValid.error;
        }

        var endpointPostfix = options.accountToken ? '/2.0/:username/:projectName/commit/:commitId/coverage/:language' : '/2.0/coverage/:commitId/:language';

        var endpoint = (options.endpoint || 'https://api.codacy.com') + endpointPostfix;

        logger.debug('Setting up reporter communicating to: ' + endpoint);

        return {
            sendCoverage: function sendCoverage(token, commitId, language, data, accountToken, username, projectName) {
                logger.trace(util.format('Sending Coverage for token [%s] and commitId [%s]', token, commitId));
                var tokenValid = Joi.validate(token, tokenValidation);
                var commitIdValid = Joi.validate(commitId, commitIdValidation);
                var dataValid = Joi.validate(data, coverageDataValidation, {
                    stripUnknown: true
                });
                var validationErr = commitIdValid.error || dataValid.error;

                if (accountToken) {
                    var accountTokenValid = Joi.validate(accountToken, accountTokenValidation);
                    var usernameValid = Joi.validate(username, usernameValidation);
                    var projectNameValid = Joi.validate(projectName, projectNameValidation);

                    validationErr = validationErr || accountTokenValid.error || usernameValid.error || projectNameValid.error;
                } else {
                    validationErr = validationErr || tokenValid.error;
                }

                if (validationErr) {
                    logger.error(validationErr);
                    return Promise.reject(validationErr);
                }

                if (language) {
                    return sendForLanguage(endpoint, commitId, language, token, data, accountToken, username, projectName);
                }

                return sendByLanguage(endpoint, commitId, token, data, accountToken, username, projectName);
            }
        };
    };
}(require('request-promise'), require('joi'), require('bluebird'), require('util'), require('lodash'), require('./logger')()));
