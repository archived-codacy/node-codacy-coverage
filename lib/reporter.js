(function (request, Joi, Q, util) {
    'use strict';
    /*
     Our API end point for code coverage is open and ready.
     The end point is as follows:
     POST          /coverage/:token/:commitUuid

     The token is taken from the project settings.
     The commitUuid is.. well.. the UUID of the commit.

     Then we're expecting the post to have a file in its body.
     The file should have this Json structure:

     {'total':50,'fileReports':[{'filename':'filename','total':10,'coverage':{'1':1,'2':3}}]}

     total: total percentage of code coverage of the project (Int)
     fileReports: a report for each file (Array of Objects)
     filename: the file name (String)
     total: total percentage of code coverage of the file (Int)
     coverage: object of lines -> number of times passed in tests (Object)
     'number': the line number tested (String)
     number: the number of times your tests passed this line (Int)
     */

    var optionsValidation = Joi.object({
            endpoint: Joi.string().min(1).optional().example('https://codacy.com/coverage/:token/:commitId')
        }),
        tokenValidation = Joi.string().required().min(1).example('1234567890'),//TODO: Revisit this validation to see if we can better validate the values
        commitIdValidation = Joi.string().required().min(1).example('1234567890'), //TODO: Revisit this validation to see if we can better validate the values
        coverageDataValidation = Joi.object({
            total: Joi.number().integer().required().min(0).max(100),
            fileReports: Joi.array().required().includes(Joi.object({
                filename: Joi.string().required().min(1),
                total: Joi.number().integer().required().min(0).max(100),
                coverage: Joi.object().pattern(/\d/, Joi.number().integer().min(1))
            }).optional())
        }).example({total: 50, fileReports: [{filename: 'filename', total: 10, coverage: {1: 1, 2: 3}}]});

    module.exports = function (options) {
        var optionsValid = Joi.validate(optionsValidation, options, {
            stripUnknown: true
        });

        if (optionsValid.error) {
            throw optionsValid.error;
        }

        var endpoint = options.endpoint || 'https://codacy.com/coverage/:token/:commitId';

        return {
            sendCoverage: function sendCoverage(token, commitId, data) {
                var deferred = Q.defer();

                process.nextTick(function () {
                    var tokenValid = Joi.validate(token, tokenValidation),
                        commitIdValid = Joi.validate(commitId, commitIdValidation),
                        dataValid = Joi.validate(data, coverageDataValidation, {
                            stripUnknown: true
                        }),
                        validationErr = tokenValid.error || commitIdValid.error || dataValid.error;

                    if (validationErr) {
                        throw validationErr;
                    }

                    return request({
                        url: endpoint.replace(':token', token).replace(':commitId', commitId),
                        method: 'POST',
                        json: data,
                        resolveWithFullResponse: true
                    }).then(function (res) {
                        if (res.statusCode !== 200) {
                            var err = new Error(util.format('Expected Status Code of 200, but got [%s]', res.statusCode));
                            err.response = res;
                            err.body = res.body;
                            deferred.reject(err);
                        }
                        deferred.resolve();
                    }, function (res) {
                        var err = new Error(util.format('Expected Successful Status Code, but got [%s]', res.statusCode));
                        err.response = res;
                        err.body = res.body;
                        deferred.reject(err);
                    });
                });
                return deferred.promise;
            }
        };
    };
}(require('request-promise'), require('joi'), require('q'), require('util')));