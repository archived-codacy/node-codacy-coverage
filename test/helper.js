(function (nock, chai, Q) {
    var expect = chai.expect;
    chai.use(require('dirty-chai'));
    chai.config.includeStack = true;

    // Disable outgoing connections to non-mocked endpoints.
    nock.disableNetConnect();

    //Setup mock for the Codacy API endpoint.
    function setupMockEndpoint(token, commitId, bodyValidator, statusCode) {
        var deferred = Q.defer();
        process.nextTick(function () {
            try {
                expect(token).to.be.ok();
                expect(commitId).to.be.ok();
                expect(bodyValidator).to.be.ok();

                deferred.resolve(nock('https://codacy.com')
                    .post('/coverage/' + token + '/' + commitId, function (body) {
                        var result = bodyValidator.validate(body);
                        return result.error ? false : true;
                    })
                    .reply(statusCode || 200));
            } catch (err) {
                deferred.reject(err);
            }
        });
        return deferred.promise;
    }

    module.exports = {
        setupMockEndpoint: setupMockEndpoint
    };
}(require('nock'), require('chai'), require('q')));