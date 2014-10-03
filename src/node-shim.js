// EnoFJS
// Version: 3.1.0
//
// Copyright (c) 2014.
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
/* istanbul ignore next */
(function nodeShimScope(window) {
    'use strict';

    // Our map of modules.
    var registeredModules = {};

    // A shim for require.
    function requireShim(moduleName) {
        return registeredModules[moduleName.replace(/(.\/)|.js/g, '')];
    }

    // A require wrapper for when requirejs exists.
    function requirejsWrapper(moduleName) {
        try {
            if (typeof moduleName === 'string') {
                return originalRequire(moduleName);
            } else {
                return originalRequire.apply(window, arguments);
            }
        } catch (originalRequireError) {
            // When `require('module')` throws an error, we assume the module should be loaded
            // via the requireShim.
            var module = requireShim(moduleName);
            if (module) {
                return module;
            } else {
                throw originalRequireError;
            }
        }
    }

    if (window !== undefined) {
        // We are in a browser.
        var originalRequire = window.require;
        var requireExists = typeof originalRequire === 'function';

        if (requireExists) {
            // Use the wrapper to load the module the correct way for requirejs.
            window.require = requirejsWrapper;
        } else {
            // To unify the way commonjs is used.
            window.require = requireShim;
        }

        // To unify the way we can export modules.
        window.exports = function exports(modules, module, moduleName) {
            registeredModules[moduleName.replace(/(.\/)|.js/g, '')] = module;
        };

        // Register the node shim.
        registeredModules['node-shim'] = window;
        window.module = window;
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