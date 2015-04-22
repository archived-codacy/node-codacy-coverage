(function (Joi, request, chai, Q, reporter, helper) {
    'use strict';

    var expect = chai.expect;
    chai.use(require('chai-as-promised'));
    chai.use(require('dirty-chai'));
    chai.config.includeStack = true;

    describe('Codacy Reporter', function () {
        var bodyValidator,
            sampleCoverageData;

        beforeEach(function () {
            bodyValidator = Joi.object({
                total: Joi.number().valid(50),
                fileReports: Joi.array().includes(Joi.object({
                    filename: Joi.string().valid('filename'),
                    total: Joi.number().valid(10),
                    coverage: Joi.object({
                        1: Joi.number().valid(1),
                        2: Joi.number().valid(3)
                    })
                }))
            });

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
        });

        it('should be able to use the mock end-point', function () {
            return helper.setupMockEndpoint('1234', '4321', bodyValidator)
                .then(function () {
                    return expect(request({
                        url: 'https://www.codacy.com/api/coverage/1234/4321',
                        method: 'POST',
                        json: sampleCoverageData,
                        resolveWithFullResponse: true
                    }).promise()).to.eventually.satisfy(function (res) {
                            expect(res.statusCode).to.equal(200);
                            return true;
                        });
                });
        });
        it('shouldn\'t be able to send coverage with 0 hits on a line', function () {
            sampleCoverageData.fileReports[0].coverage['3'] = 0;

            return expect(reporter({})
                .sendCoverage('1234', '4321', sampleCoverageData))
                .to.eventually.be.rejectedWith(Error, 'fileReports at position 0 fails because 3 must be larger than or equal to 1');
        });
        it('shouldn\'t be able to create a reporter with invalid options', function () {
            expect(function () {
                reporter({endpoint: 1});
            }).to.throw(Error, 'endpoint must be a string');
        });
        it('should be able to use the reporter to send coverage data', function () {
            return helper.setupMockEndpoint('1234', '4321', bodyValidator)
                .then(function () {
                    return expect(reporter({})
                        .sendCoverage('1234', '4321', sampleCoverageData))
                        .to.eventually.be.fulfilled;
                });
        });
        it('should receive error when non-200 status code', function () {
            return helper.setupMockEndpoint('1234', '4321', bodyValidator, 204)
                .then(function () {
                    return expect(reporter({})
                        .sendCoverage('1234', '4321', sampleCoverageData))
                        .to.eventually.be.rejectedWith(Error, 'Expected Status Code of 200, but got [204]');
                });
        });
        it('should receive error when 400 level status code', function () {
            return helper.setupMockEndpoint('1234', '4321', bodyValidator, 418)
                .then(function () {
                    return expect(reporter({})
                        .sendCoverage('1234', '4321', sampleCoverageData))
                        .to.eventually.be.rejectedWith(Error, 'Expected Successful Status Code, but got [418]');
                });
        });
    });

}(require('joi'), require('request-promise'), require('chai'), require('q'), require('../lib/reporter'), require('./helper')));
