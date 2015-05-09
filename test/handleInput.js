(function (chai, handleInput) {
    'use strict';

    var expect = chai.expect;
    chai.use(require('chai-as-promised'));
    chai.use(require('dirty-chai'));
    chai.config.includeStack = true;

    describe('Handle Input', function () {
        it('should return a promise', function () {
            return expect(handleInput()).to.eventually.be.rejected;
        });
    });

}(require('chai'), require('../lib/handleInput')));
