(function (fs, parser, helper) {
    'use strict';
    var expectedCoverage = 40;
    var expect = helper.chai.expect;
    var jacocoData = fs.readFileSync(__dirname + '/mock/jacoco2.xml').toString();

    describe('Jacoco Parser', function () {
        it('should be able to parse jacoco data with empty files', function () {
            return expect(parser.getParser('jacoco').parse('', jacocoData))
                .to.eventually.satisfy(function (data) {
                    expect(data.total).to.equal(expectedCoverage);
                    return true;
                });
        });
    });
}(require('fs'), require('../lib/coverageParser'), require('./helper')));
