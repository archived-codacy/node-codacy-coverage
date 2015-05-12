(function (handleInput, helper, Joi, request, fs, path) {
    'use strict';

    var expect = helper.chai.expect;
    var lcovData = fs.readFileSync(__dirname + '/mock/lcov.info').toString();

    describe('Handle Input', function () {
        beforeEach(function () {
            helper.clearEnvironmentVariables();
        });
        it('should be able to use the mock end-point', function () {
            var bodyValidator = Joi.object({
                total: Joi.number().valid(50),
                fileReports: Joi.array().items(Joi.object({
                    filename: Joi.string().valid('filename'),
                    total: Joi.number().valid(10),
                    coverage: Joi.object({
                        1: Joi.number().valid(1),
                        2: Joi.number().valid(3)
                    })
                }).required())
            });

            var sampleCoverageData = {
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
        it('should be able to parse lcov data', function () {
            var expectedCoverage = {
                total: 92,
                fileReports: Joi.array().items(Joi.compile({
                    filename: path.normalize('lib/reporter.js'),
                    coverage: {
                        1: 1,
                        25: 1,
                        39: 1,
                        40: 3,
                        44: 3,
                        48: 3,
                        50: 3,
                        52: 3,
                        54: 3,
                        55: 3,
                        61: 3,
                        63: 3,
                        67: 3,
                        73: 2,
                        74: 1,
                        75: 1,
                        76: 1,
                        77: 1,
                        79: 2,
                        81: 1,
                        82: 1,
                        83: 1,
                        84: 1,
                        87: 3
                    },
                    total: 92
                }))
            };

            return helper.setupMockEndpoint('1234', '4321', Joi.compile(expectedCoverage))
                .then(function () {
                    return expect(handleInput(lcovData, {
                        token: '1234',
                        commit: '4321'
                    })).to.eventually.be.fulfilled();
                });
        });
        it('should be able to parse lcov data with path prefix', function () {
            var expectedCoverage = {
                total: 92,
                fileReports: Joi.array().items(Joi.compile({
                    filename: path.normalize('my-project/lib/reporter.js'),
                    coverage: {
                        1: 1,
                        25: 1,
                        39: 1,
                        40: 3,
                        44: 3,
                        48: 3,
                        50: 3,
                        52: 3,
                        54: 3,
                        55: 3,
                        61: 3,
                        63: 3,
                        67: 3,
                        73: 2,
                        74: 1,
                        75: 1,
                        76: 1,
                        77: 1,
                        79: 2,
                        81: 1,
                        82: 1,
                        83: 1,
                        84: 1,
                        87: 3
                    },
                    total: 92
                }))
            };

            return helper.setupMockEndpoint('1234', '4321', Joi.compile(expectedCoverage))
                .then(function () {
                    return expect(handleInput(lcovData, {
                        token: '1234',
                        commit: '4321',
                        prefix: 'my-project/'
                    })).to.eventually.be.fulfilled();
                });
        });
        it('shouldn\'t be able to send coverage with invalid input', function () {
            return expect(handleInput()).to.eventually.be.rejectedWith(Error, 'Token is required');
        });
    });

}(require('../lib/handleInput'), require('./helper'), require('joi'), require('request-promise'), require('fs'), require('path')));
