(function (fs, parser, helper) {
    'use strict';

    var expectedCoverage = 30;

    var expect = helper.chai.expect;
    var lcovData = fs.readFileSync(__dirname + '/mock/lcov2.info').toString();

    describe('Lcov Parser', function () {
        it('should be able to parse lcov data with empty files', function () {
            return expect(parser.getParser('lcov').parse('', lcovData))
                .to.eventually.satisfy(function (data) {
                    expect(data.total).to.equal(expectedCoverage);
                    return true;
                });
        });
    });
}(require('fs'), require('../lib/coverageParser'), require('./helper')));
