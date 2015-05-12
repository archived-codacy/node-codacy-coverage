(function (helper) {
    'use strict';

    var expect = helper.chai.expect;
    var logger;

    describe('Logger', function () {
        beforeEach(function () {
            process.env.CODACY_VERBOSE = '';
            process.env.CODACY_DEBUG = '';

            delete require.cache[require.resolve('log-driver')];
            delete require.cache[require.resolve('../lib/logger')];
            logger = require('../lib/logger');
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

            expect(logger()).to.be.ok();
            expect(logger().level).to.equal('warn');
        });
    });
}(require('./helper')));