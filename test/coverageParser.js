(function (Joi, chai, Q, util, parser) {
    'use strict';

    var expect = chai.expect,
        validFormats = ['lcov'];
    chai.use(require('chai-as-promised'));
    chai.use(require('dirty-chai'));
    chai.config.includeStack = true;

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
        });
    });
}(require('joi'), require('chai'), require('q'), require('util'), require('../lib/coverageParser')));