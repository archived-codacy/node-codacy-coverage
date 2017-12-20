(function (handleInput, helper, Joi, request, fs, path, Promise) {
    'use strict';
    /*eslint new-cap: ["error", { "newIsCap": false }]*/

    var expect = helper.chai.expect;
    var lcov2Data = fs.readFileSync(__dirname + '/mock/lcov2.info').toString();
    var lcovMultiData = fs.readFileSync(__dirname + '/mock/lcov-multilang.info').toString();
    var originalCodacyToken = process.env.CODACY_PROJECT_TOKEN || process.env.CODACY_REPO_TOKEN;

    describe('Handle Input', function () {
        beforeEach(function () {
            helper.clearEnvironmentVariables();
            process.env.CODACY_PROJECT_TOKEN = originalCodacyToken;
        });
        it('should be able to parse multiple files lcov data', function () {
            var expectedCoverage = {
                total: 30,
                fileReports: Joi.array().items(Joi.compile({
                    filename: path.normalize('FileA.js'),
                    coverage: {
                        1: 0,
                        2: 0,
                        9: 0,
                        19: 0
                    },
                    total: 0
                }),
                Joi.compile({
                    filename: path.normalize('FileB.js'),
                    coverage: {
                        1: 0,
                        2: 0
                    },
                    total: 0
                }),
                Joi.compile({
                    filename: path.normalize('FileC.js'),
                    coverage: {
                        1: 1,
                        2: 1,
                        3: 1,
                        7: 0
                    },
                    total: 75
                }))
            };

            return helper.setupMockEndpoint('1234', '4321', Joi.compile(expectedCoverage))
                .then(function () {
                    return expect(handleInput(lcov2Data, {
                        token: '1234',
                        commit: '4321'
                    })).to.eventually.be.fulfilled();
                });
        });
        it('should be able to parse multiple lang files lcov data', function () {
            var expectedCoverageJS = {
                total: 30,
                fileReports: Joi.array().items(Joi.compile({
                    filename: path.normalize('FileA.js'),
                    coverage: {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        9: 0,
                        19: 0
                    },
                    total: 0
                }),
                Joi.compile({
                    filename: path.normalize('FileC.js'),
                    coverage: {
                        1: 1,
                        2: 1,
                        3: 1,
                        7: 0
                    },
                    total: 75
                }))
            };
            var expectedCoverageTS = {
                total: 40,
                fileReports: Joi.array().items(Joi.compile({
                    filename: path.normalize('FileB.ts'),
                    coverage: {
                        1: 1,
                        2: 1,
                        3: 0,
                        4: 0
                    },
                    total: 50
                }),
                Joi.compile({
                    filename: path.normalize('FileB2.ts'),
                    coverage: {
                        1: 0
                    },
                    total: 0
                }))
            };

            return new Promise.all(
                [
                    helper.setupLangMockEndpoint('1234', '4321', Joi.compile(expectedCoverageJS), 'javascript'),
                    helper.setupLangMockEndpoint('1234', '4321', Joi.compile(expectedCoverageTS), 'typescript')
                ]
            ).then(function () {
                return expect(handleInput(lcovMultiData, {
                    token: '1234',
                    commit: '4321'
                })).to.eventually.be.fulfilled();
            });
        });
    });

}(require('../lib/handleInput'), require('./helper'), require('joi'),
    require('request-promise'), require('fs'), require('path'), require('bluebird')));
