(function() {
    System.config({
        meta: {
            'node_modules/weakmap/weakmap.js': {
                format: 'global',
                exports: 'WeakMap',
            },
        },
        paths: {
            'chialab/*': 'node_modules/chialab-*',
        },
    });
}());
