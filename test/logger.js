(function (Joi, chai, Q, util, logger) {
    'use strict';

    var expect = chai.expect;
    chai.use(require('chai-as-promised'));
    chai.use(require('dirty-chai'));
    chai.config.includeStack = true;

    describe('Logger', function () {
        beforeEach(function() {
            process.env.CODACY_VERBOSE = '';
            process.env.CODACY_DEBUG = '';
        });
        it('should be able to instantiate the logger without options', function () {
            var loggerImpl = logger();
            expect(loggerImpl.level).to.equal('warn');
        });
        it('should be able to instantiate the logger in verbose mode', function () {
            var loggerImpl = logger({verbose: true});
            expect(loggerImpl.level).to.equal('debug');
        });
        it('should be able to instantiate the logger in debug mode', function () {
            var loggerImpl = logger({debug: true});
            expect(loggerImpl.level).to.equal('trace');
        });
        it('should be able to instantiate the logger in debug mode without environment variables overriding', function () {
            process.env.CODACY_VERBOSE = true;

            var loggerImpl = logger({debug: true});
            expect(loggerImpl.level).to.equal('trace');
        });
        it('should be able to instantiate the logger in verbose mode without environment variables overriding', function () {
            process.env.CODACY_DEBUG = true;

            var loggerImpl = logger({verbose: true});
            expect(loggerImpl.level).to.equal('debug');
        });
        it('should be able to instantiate the logger in verbose mode with an environment variable', function () {
            process.env.CODACY_VERBOSE = true;

            var loggerImpl = logger();
            expect(loggerImpl.level).to.equal('debug');
        });
        it('should be able to instantiate the logger in debug mode', function () {
            process.env.CODACY_DEBUG = true;

            var loggerImpl = logger();
            expect(loggerImpl.level).to.equal('trace');
        });
        it('should be able to instantiate the logger and retrieve the instance of it', function () {
            var loggerImpl = logger();
            expect(loggerImpl.level).to.equal('warn');

            expect(require('log-driver').logger).to.be.ok();
            expect(require('log-driver').logger.level).to.equal('warn');
        });
    });
}(require('joi'), require('chai'), require('q'), require('util'), require('../lib/logger')));