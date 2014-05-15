// EnoFJS
// Version: 2.0.0
//
// Copyright (c) 2014.
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS

(function nodeShimScope(window) {
    'use strict';

    if (window !== undefined) {
        // A namespace for our modules to be published on.
        window.module = {};

        // To unify the way commonjs is used.
        window.require = function require(moduleName) {
            return window.module[moduleName] || window;
        };

        // To unify the way we can export modules.
        window.exports = function exports(modules, module, moduleName) {
            window.module[moduleName] = module;
        };
    } else {
        // Now we assume this is a node.js app.
        module.exports = {
            require: require,
            exports: function exports(modules, moduleToExport) {
                modules.exports = moduleToExport;
            }
        };
    }
}(this.window));