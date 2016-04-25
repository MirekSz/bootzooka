'use strict';

var config = require('../../../package.json').babelBoilerplateOptions;

global.mocha.setup('bdd');
mocha.setup({globals: ['hasCert']});
global.onload = function () {
    global.mocha.checkLeaks();
    global.mocha.globals(config.mochaGlobals);
    global.mocha.run();
    require('./setup-browserify')();
};
