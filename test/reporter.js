(function (nock, Joi, request, chai, Q, reporter) {
    'use strict';

    var expect = chai.expect;
    chai.use(require('chai-as-promised'));
    chai.use(require('dirty-chai'));
    chai.config.includeStack = true;

    // Disable outgoing connections to non-mocked endpoints.
    nock.disableNetConnect();

    //Setup mock for the Codacy API endpoint.
    function setupMockEndpoint(token, commitId, bodyValidator, statusCode) {
        var deferred = Q.defer();
        process.nextTick(function () {
            try {
                expect(token).to.be.ok();
                expect(commitId).to.be.ok();
                expect(bodyValidator).to.be.ok();

                nock('https://codacy.com')
                    .post('/coverage/' + token + '/' + commitId, function (body) {
                        var result = bodyValidator.validate(body);
                        return result.error ? false : true;
                    })
                    .reply(statusCode || 200);
                deferred.resolve();
            } catch (err) {
                deferred.reject(err);
            }
        });
        return deferred.promise;
    }

    describe('Codacy Reporter', function () {
        var bodyValidator = Joi.object({
                total: Joi.number().valid(50),
                fileReports: Joi.array().includes(Joi.object({
                    filename: Joi.string().valid('filename'),
                    total: Joi.number().valid(10),
                    coverage: Joi.object({
                        1: Joi.number().valid(1),
                        2: Joi.number().valid(3)
                    })
                }))
            }),
            sampleCoverageData = {
                total: 50,
                fileReports: [
                    {
                        filename: 'filename',
                        total: 10,
                        coverage: {
                            1: 1,
                            2: 3
                        }
                    }
                ]
            };

        it('should be able to use the mock end-point', function () {
            return setupMockEndpoint('1234', '4321', bodyValidator)
                .then(function () {
                    return expect(request({
                        url: 'https://codacy.com/coverage/1234/4321',
                        method: 'POST',
                        json: sampleCoverageData,
                        resolveWithFullResponse: true
                    }).promise()).to.eventually.satisfy(function (res) {
                            expect(res.statusCode).to.equal(200);
                            return true;
                        });
                });
        });
        it('should be able to use the reporter to send coverage data', function () {
            return setupMockEndpoint('1234', '4321', bodyValidator)
                .then(function () {
                    return expect(reporter({endpoint: 'https://codacy.com/coverage/:token/:commitId'})
                        .sendCoverage('1234', '4321', sampleCoverageData))
                        .to.eventually.be.fulfilled;
                });
        });
        it('should receive error when non-200 status code', function () {
            return setupMockEndpoint('1234', '4321', bodyValidator, 204)
                .then(function () {
                    return expect(reporter({endpoint: 'https://codacy.com/coverage/:token/:commitId'})
                        .sendCoverage('1234', '4321', sampleCoverageData))
                        .to.eventually.be.rejectedWith(Error, 'Expected Status Code of 200, but got [204]');
                });
        });
        it('should receive error when 400 level status code', function () {
            return setupMockEndpoint('1234', '4321', bodyValidator, 418)
                .then(function () {
                    return expect(reporter({endpoint: 'https://codacy.com/coverage/:token/:commitId'})
                        .sendCoverage('1234', '4321', sampleCoverageData))
                        .to.eventually.be.rejectedWith(Error, 'Expected Successful Status Code, but got [418]');
                });
        });
    });

}(require('nock'), require('joi'), require('request-promise'), require('chai'), require('q'), require('../lib/reporter')));