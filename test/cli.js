(function (chai, Q, exec, Joi, parser, helper) {
    'use strict';

    var expect = chai.expect;
    chai.use(require('chai-as-promised'));
    chai.use(require('dirty-chai'));
    chai.config.includeStack = true;

    describe('Command Line', function () {
        it('should be able to get help with `-h`', function (done) {
            exec('node ./bin/codacy.js -h', function (err, res) {
                expect(res).to.equal('\n' +
                    '  Usage: codacy [options]\n\n' +
                    '  Options:\n\n' +
                    '    -h, --help              output usage information\n' +
                    '    -V, --version           output the version number\n' +
                    '    -f, --format [value]    Coverage input format\n' +
                    '    -t, --token [value]     Set Token\n' +
                    '    -c, --commit [value]    Set Commit Id\n' +
                    '    -e, --endpoint [value]  Set Endpoint\n' +
                    '    -v, --verbose           Display verbose output\n' +
                    '    -d, --debug             Display debug output\n\n'
                );
                done();
            });
        });
        it('should be able to get help with `-help`', function (done) {
            exec('node ./bin/codacy.js -help', function (err, res) {
                expect(res).to.equal('\n' +
                    '  Usage: codacy [options]\n\n' +
                    '  Options:\n\n' +
                    '    -h, --help              output usage information\n' +
                    '    -V, --version           output the version number\n' +
                    '    -f, --format [value]    Coverage input format\n' +
                    '    -t, --token [value]     Set Token\n' +
                    '    -c, --commit [value]    Set Commit Id\n' +
                    '    -e, --endpoint [value]  Set Endpoint\n' +
                    '    -v, --verbose           Display verbose output\n' +
                    '    -d, --debug             Display debug output\n\n'
                );
                done();
            });
        });
        it.only('should be able to parse lcov data', function (done) {
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
                exec('cat ./test/mock/lcov.info | node ./bin/codacy.js --debug --token 1234 --commit 4321', function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    expect(res).to.match(/301 Moved Permanently/);
                    //nock.done(); //TODO: Need to figure out how to use nock here. Since it's a separate process, it's not tied together.
                    done();
                });
            });
        });
    });
}(require('chai'), require('q'), require('child_process').exec, require('joi'), require('../'), require('./helper')));