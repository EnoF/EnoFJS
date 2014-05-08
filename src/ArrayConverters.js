// EnoFJS 
// Version: 1.2.1
//
// Copyright (c) 2014. 
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
(function ArrayConvertersScope(Array, Uint8Array, Uint32Array) {
    'use strict';

    // The Array buffer will expect the combined 4 bytes in reversed order.
    function toUint32Array() {
        // jshint validthis:true
        var self = this;
        var uint32Array = new Uint32Array(self.length / 4);
        for (var i = 0; i < self.length; i = i + 4) {
            uint32Array[i / 4] = (self[i + 3] << 24 |
                self[i + 2] << 16 |
                self[i + 1] << 8 |
                self[i]) >>> 0;
        }
        return uint32Array;
    }

    // This should actually work with other Typed arrays as well, but I haven't tested this yet!
    function readUint32ArrayIn(uInt32) {
        // jshint validthis:true
        var self = this;
        var uInt8 = new Uint8Array(uInt32.buffer);
        for (var i = 0; i < uInt8.length; i = i + 1) {
            self[i] = uInt8[i];
        }
    }

    Array.prototype.toUint32Array = toUint32Array;
    Array.prototype.readUint32ArrayIn = readUint32ArrayIn;

}(window.Array, window.Uint8Array, window.Uint32Array));