// EnoFJS 
// Version: 2.0.1
//
// Copyright (c) 2014. 
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
(function indexScope() {
    'use strict';

    // Load modules that don't have any exports.
    require('./src/ArrayConverters');
    require('./src/Serializable.js');
    var shim = require('./src/node-shim.js');

    // Expose modules.
    module.exports = {
        clazz: require('./src/clazz.js'),
        LinkedHashMap: require('./src/LinkedHashMap.js'),
        exports: shim.exports,
        require: require
    };
}());