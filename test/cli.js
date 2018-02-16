(function (exec, Joi, parser, helper) {
    'use strict';

    var expect = helper.chai.expect;

    describe('Command Line', function () {
        it('should be able to parse lcov data', function (done) {
            var bodyObject = {
                total: 92,
                fileReports: [
                    {
                        filename: '/Users/david.pate/Git/codacy-coverage/lib/reporter.js',
                        coverage: {
                            1: 1,
                            25: 1,
                            39: 1,
                            40: 3,
                            44: 3,
                            45: 0,
                            48: 3,
                            50: 3,
                            52: 3,
                            54: 3,
                            55: 3,
                            61: 3,
                            63: 3,
                            64: 0,
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
                    }
                ]
            };

            helper.setupMockEndpoint('1234', '4321', Joi.compile(bodyObject)).then(function () {
                exec('cat ./test/mock/lcov.info | node ./bin/codacy-coverage.js --token 1234 --commit 4321', function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    expect(res).to.match(/Status Code \[404\] - Error \[{"error":"not found"}\]/);
                    //nock.done(); //TODO: Need to figure out how to use nock here. Since it's a separate process, it's not tied together.
                    done();
                });
            });
        });
        it('should be able to set options', function (done) {
            exec('cat ./test/mock/no-lines.info | node ./bin/codacy-coverage.js --debug --verbose --token 1234 --commit 4321 --prefix asdf/ --endpoint something --format lcov', function (err, res) {
                if (err) {
                    return done(err);
                }

                expect(res).to.match(/Started with: token \["1234"], accountToken \[undefined], username \[undefined], projectName \[undefined], commitId \["4321"], language \[undefined], endpoint \["something"], format \["lcov"], path prefix \["asdf\/"], verbose \[true], debug \[true]/);
                expect(res).to.match(/Handling input for: token \["1234"], accountToken \[undefined], username \[undefined], projectName \[undefined], commitId \["4321"], language \[undefined], endpoint \["something"], format \["lcov"], path prefix \["asdf\/"], verbose \[true], debug \[true]/);
                done();
            });
        });
    });
}(require('child_process').exec, require('joi'), require('../'), require('./helper')));
