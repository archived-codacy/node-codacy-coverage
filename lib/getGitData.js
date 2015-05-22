(function (logger, exec, Promise) {
    'use strict';
    module.exports = {
        getCommitId: function (commitId) {
            return new Promise(function (resolve, reject) {
                if (commitId) {
                    logger.debug('Provided Commit Id: ' + commitId);
                    return resolve(commitId);
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
                    return resolve(gitCommit);
                }

                exec('git rev-parse HEAD', function (err, commitId) {
                    if (err) {
                        return reject(err);
                    }
                    commitId = commitId.trim();
                    logger.debug('Got Commit Id: ' + commitId);
                    resolve(commitId);
                });
            });
        }
    };
}(require('./logger')(), require('child_process').exec, require('bluebird')));
