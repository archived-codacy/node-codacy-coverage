(function (fs, parser, helper, path) {
    'use strict';

    var expect = helper.chai.expect;
    var jacocoData = fs.readFileSync(__dirname + '/mock/jacoco.xml').toString();
    var noStatsJacocoData = fs.readFileSync(__dirname + '/mock/no-lines.xml').toString();
    describe('Jacoco Parser', function () {

        it('should be to parse jacoco data', function () {
            return expect(parser.getParser('jacoco').parse('',jacocoData))
                .to.eventually.satisfy(function (data) {
                    expect(data).to.deep.equal({
                        total: 23,
                        fileReports: [
                            {
                                filename: path.normalize('com/wmbest/myapplicationtest/MainActivity.java'),
                                coverage: {
                                    8: 0,
                                    11: 2,
                                    12: 1,
                                    13: 7,
                                    18: 0,
                                    19: 0,
                                    20: 0,
                                    25: 0,
                                    26: 0,
                                    34: 0,
                                    37: 0,
                                    38: 0,
                                    41: 0
                                },
                                total: 23 }]
                    });
                    return true;
                });
        });

        it('should be able to parse jacoco data with path prefix', function () {
            return expect(parser.getParser('jacoco').parse(path.normalize('my-project' + path.sep), jacocoData))
                .to.eventually.satisfy(function (data) {
                    expect(data).to.deep.equal({
                        total: 23,
                        fileReports: [
                            {
                                filename: path.normalize('my-project/com/wmbest/myapplicationtest/MainActivity.java'),
                                coverage: {
                                    8: 0,
                                    11: 2,
                                    12: 1,
                                    13: 7,
                                    18: 0,
                                    19: 0,
                                    20: 0,
                                    25: 0,
                                    26: 0,
                                    34: 0,
                                    37: 0,
                                    38: 0,
                                    41: 0
                                },
                                total: 23 }]
                    });
                    return true;
                });
        });

        it('should be able to parse jacoco data without lines', function() {
            return expect(parser.getParser('jacoco').parse('', noStatsJacocoData))
                .to.eventually.satisfy(function (data) {
                    expect(JSON.stringify(data)).to.equal(JSON.stringify({
                        total: 0,
                        fileReports: [
                            {
                                filename: path.normalize('com/wmbest/myapplicationtest/MainActivity.java'),
                                coverage: {},
                                total: 0
                            }]
                    }));
                    return true;
                });
        });
    });
}(require('fs'), require('../lib/coverageParser'),require('./helper'), require('path')));
