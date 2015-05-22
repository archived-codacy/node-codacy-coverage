(function (fs, parser, helper, path) {
    'use strict';

    var expect = helper.chai.expect;
    var lcovData = fs.readFileSync(__dirname + '/mock/lcov.info').toString();
    var noStatsLcovData = fs.readFileSync(__dirname + '/mock/no-lines.info').toString();
    var nadaLcovData = fs.readFileSync(__dirname + '/mock/nada.info').toString();

    describe('Lcov Parser', function () {
        it('should be able to parse lcov data', function () {
            return expect(parser.getParser('lcov').parse('', lcovData))
                .to.eventually.satisfy(function (data) {
                    expect(data).to.deep.equal({
                        total: 92,
                        fileReports: [
                            {
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
                            }
                        ]
                    });
                    return true;
                });
        });
        it('should be able to parse lcov data with path prefix', function () {
            return expect(parser.getParser('lcov').parse(path.normalize('my-project/'), lcovData))
                .to.eventually.satisfy(function (data) {
                    expect(data).to.deep.equal({
                        total: 92,
                        fileReports: [
                            {
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
                            }
                        ]
                    });
                    return true;
                });
        });
        it('should be able to parse lcov data without lines', function () {
            return expect(parser.getParser('lcov').parse('', noStatsLcovData))
                .to.eventually.satisfy(function (data) {
                    expect(JSON.stringify(data)).to.equal(JSON.stringify({
                        total: 0,
                        fileReports: [
                            {
                                filename: path.normalize('lib/reporter.js'),
                                coverage: {},
                                total: 0
                            }
                        ]
                    }));
                    return true;
                });
        });
        it('should be able to parse lcov data without anything', function () {
            return expect(parser.getParser('lcov').parse('', nadaLcovData))
                .to.eventually.satisfy(function (data) {
                    expect(JSON.stringify(data)).to.equal(JSON.stringify({
                        total: 0,
                        fileReports: [
                            {
                                filename: '',
                                coverage: {},
                                total: 0
                            }
                        ]
                    }));
                    return true;
                });
        });
    });
}(require('fs'), require('../lib/coverageParser'), require('./helper'), require('path')));
