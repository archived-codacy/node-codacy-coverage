(function (Joi, util, logger) {
    'use strict';

    var validFormats = ['lcov'],
        formatValidation = Joi.string().valid(validFormats).required();
    module.exports = {
        getParser: function getParser(coverageFormat) {
            var validFormat = Joi.validate(coverageFormat, formatValidation);

            if (validFormat.error) {
                logger.error(validFormat.error);
                throw new Error(util.format('Expected one of the following supported formats: %j, but got [%s]', validFormats, coverageFormat));
            }

            try {
                logger.debug('Creating coverage parser for: ' + coverageFormat);
                return require('./impl/' + coverageFormat);
            } catch (err) {
                logger.error('Error creating coverage parser for: ' + coverageFormat);
                logger.error(err);
                throw err;
            }
        }
    };
}(require('joi'), require('util'), require('log-driver').logger));