'use strict';

module.exports = function(karma) {
    karma.files = karma.files || [];
    karma.files.unshift('node_modules/chialab-callback-manager/src/callback-manager.js');
};
