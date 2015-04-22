(function (logger, exec, Q) {
    'use strict';
    module.exports = {
        getCommitId: function (commitId) {
            var deferred = Q.defer();
            process.nextTick(function () {
                if (commitId) {
                    logger.debug('Provided Commit Id: ' + commitId);
                    return deferred.resolve(commitId);
                }

                var gitCommit = process.env.CODACY_GIT_COMMIT ||
                    process.env.TRAVIS_COMMIT ||
                    process.env.DRONE_COMMIT ||
                    process.env.GIT_COMMIT ||
                    process.env.CIRCLE_SHA1 ||
                    process.env.CI_COMMIT_ID ||
                    process.env.WERCKER_GIT_COMMIT;

                if (gitCommit) {
                    logger.debug('Received Commit Id: ' + gitCommit);
                    return deferred.resolve(gitCommit);
                }

                exec('git rev-parse HEAD', function (err, commitId) {
                    if (err) {
                        return deferred.reject(err);
                    }
                    commitId = commitId.trim();
                    logger.debug('Got Commit Id: ' + commitId);
                    deferred.resolve(commitId);
                });
            });
            return deferred.promise;
        }
    };
}(require('./logger')(), require('child_process').exec, require('q')));
