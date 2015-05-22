(function () {
    'use strict';

    module.exports = {
        safeDivision: function (numerator, denominator) {
            if (denominator === 0 || isNaN(denominator)) {
                return 0;
            } else {
                return numerator / denominator;
            }
        }
    };

})();
