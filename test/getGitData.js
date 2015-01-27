(function (Joi, chai, Q, util, getGitData) {
    'use strict';

    var expect = chai.expect,
        actualTravisCommit = process.env.TRAVIS_COMMIT; // Store the commit id for the test, if we have it
    chai.use(require('chai-as-promised'));
    chai.use(require('dirty-chai'));
    chai.config.includeStack = true;

    describe('Get Git Data', function () {
        beforeEach(function () {
            process.env.CODACY_GIT_COMMIT = '';
            process.env.TRAVIS_COMMIT = '';
            process.env.DRONE_COMMIT = '';
            process.env.GIT_COMMIT = '';
            process.env.CIRCLE_SHA1 = '';
            process.env.CI_COMMIT_ID = '';
            process.env.WERCKER_GIT_COMMIT = '';
        });
        it('should be able to get the commit id when one is passed', function () {
            return expect(getGitData.getCommitId('1234')).to.eventually.equal('1234');
        });
        it('should be able to get the commit id from the Codacy environment variable', function () {
            process.env.CODACY_GIT_COMMIT = '1234';
            return expect(getGitData.getCommitId()).to.eventually.equal('1234');
        });
        it('should be able to get the commit id from the Travis CI environment variable', function () {
            process.env.TRAVIS_COMMIT = '4321';
            return expect(getGitData.getCommitId()).to.eventually.equal('4321');
        });
        it('should be able to get the commit id from the Drone environment variable', function () {
            process.env.DRONE_COMMIT = '42';
            return expect(getGitData.getCommitId()).to.eventually.equal('42');
        });
        it('should be able to get the commit id from the Jenkins environment variable', function () {
            process.env.GIT_COMMIT = '16';
            return expect(getGitData.getCommitId()).to.eventually.equal('16');
        });
        it('should be able to get the commit id from the Circle CI environment variable', function () {
            process.env.CIRCLE_SHA1 = '743';
            return expect(getGitData.getCommitId()).to.eventually.equal('743');
        });
        it('should be able to get the commit id from the CI environment variable', function () {
            process.env.CI_COMMIT_ID = '209';
            return expect(getGitData.getCommitId()).to.eventually.equal('209');
        });
        it('should be able to get the commit id from the Wrecker environment variable', function () {
            process.env.WERCKER_GIT_COMMIT = '5232';
            return expect(getGitData.getCommitId()).to.eventually.equal('5232');
        });
        it('should be able to get the commit id from Git', function () {
            // If we are currently running on Travis, we should be able to use the commit id environment variable
            // to check the git commit id method with actual git.
            if (actualTravisCommit) {
                return expect(getGitData.getCommitId()).to.eventually.equal(actualTravisCommit);
            }
            return expect(getGitData.getCommitId()).to.eventually.be.fulfilled;
        });
    });
}(require('joi'), require('chai'), require('q'), require('util'), require('../lib/getGitData')));