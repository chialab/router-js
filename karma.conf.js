'use strict';

module.exports = function(karma) {
    karma.files = karma.files || [];
    karma.files.unshift(
        'node_modules/html5-history-api/history.js',
        'node_modules/chialab-callback-manager/src/callback-manager.js'
    );
};
