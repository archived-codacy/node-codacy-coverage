(function (Joi, util) {
    'use strict';

    var validFormats = ['lcov'],
        formatValidation = Joi.string().valid(validFormats).required();
    module.exports = {
        getParser: function getParser(coverageFormat) {
            var validFormat = Joi.validate(coverageFormat, formatValidation);

            if (validFormat.error) {
                throw new Error(util.format('Expected one of the following supported formats: %j, but got [%s]', validFormats, coverageFormat));
            }

            try {
                return require('./impl/' + coverageFormat);
            } catch (err) {
                throw err;
            }
        }
    };
}(require('joi'), require('util')));