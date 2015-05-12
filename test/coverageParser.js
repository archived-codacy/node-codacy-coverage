(function (util, parser, helper) {
    'use strict';

    var expect = helper.chai.expect;
    var validFormats = ['lcov'];

    describe('Coverage Parser', function () {
        it('should receive an error when trying to use an unsupported format', function () {
            expect(function () {
                parser.getParser('invalid-format');
            }).to.throw(Error, util.format('Expected one of the following supported formats: %j, but got [%s]', validFormats, 'invalid-format'));
        });

        validFormats.forEach(function (format) {
            it('should be able to instantiate the parser for ' + format, function () {
                expect(function () {
                    parser.getParser(format);
                }).to.not.throw();
            });
            it('shouldn\'t be able to parse a blank coverage file for ' + format, function () {
                return expect(parser.getParser(format).parse('')).to.eventually.be.rejectedWith(Error, '"value" is required');
            });
            it('shouldn\'t be able to parse invalid coverage for ' + format, function () {
                return expect(parser.getParser(format).parse('', 'There is no Dana, only Zuul')).to.eventually.be.rejectedWith(Error, 'Failed to parse string');
            });
            it('shouldn\'t be able to parse a non-existent coverage file for ' + format, function () {
                return expect(parser.getParser(format).parse('', '/no-exist/lcov')).to.eventually.be.rejectedWith(Error, 'Failed to parse string');
            });
        });
    });
}(require('util'), require('../lib/coverageParser'), require('./helper')));