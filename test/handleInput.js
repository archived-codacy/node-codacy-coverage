(function (handleInput, helper) {
    'use strict';

    var expect = helper.chai.expect;

    describe('Handle Input', function () {
        it('should return a promise', function () {
            return expect(handleInput()).to.eventually.be.rejected();
        });
    });

}(require('../lib/handleInput'), require('./helper')));
