(function (nock, chai, Promise) {
    'use strict';

    var expect = chai.expect;
    chai.use(require('chai-as-promised'));
    chai.use(require('dirty-chai'));
    chai.config.includeStack = true;

    // Disable outgoing connections to non-mocked endpoints.
    nock.disableNetConnect();

    //Setup mock for the Codacy API endpoint.
    function setupMockEndpoint(token, commitId, bodyValidator, statusCode) {
        return new Promise(function (resolve) {
            expect(token).to.be.ok();
            expect(commitId).to.be.ok();
            expect(bodyValidator).to.be.ok();

            return resolve(nock('https://api.codacy.com')
                .post('/2.0/coverage/' + commitId + '/javascript', function (body) {
                    var result = bodyValidator.validate(body);
                    return result.error ? false : true;
                })
                .reply(statusCode || 200));
        });
    }

    module.exports = {
        setupMockEndpoint: setupMockEndpoint,
        chai: chai,
        clearEnvironmentVariables: function () {
            process.env.CODACY_GIT_COMMIT = '';
            process.env.TRAVIS_COMMIT = '';
            process.env.DRONE_COMMIT = '';
            process.env.GIT_COMMIT = '';
            process.env.CIRCLE_SHA1 = '';
            process.env.CI_COMMIT_ID = '';
            process.env.WERCKER_GIT_COMMIT = '';
        }
    };
}(require('nock'), require('chai'), require('bluebird')));