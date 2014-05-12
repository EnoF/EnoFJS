// EnoFJS 
// Version: 1.1.3
//
// Copyright (c) 2014. 
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
(function SerializableScope(window, clazz, undefined) {
    'use strict';

    var Serializable = clazz(function Serializable() {

        this.private = {
            deserialize: function deserialize(serialized) {
                for (var i in serialized) {
                    if (i in this.protected) {
                        this.protected[i] = serialized[i];
                    } else if (i in this.private) {
                        this.private[i] = serialized[i];
                    }
                }
            },
            isNumberOrString: function isNumberOrString(property) {
                var type = typeof property;
                return type === 'number' || type === 'string';
            },
            serializeArray: function serializeArray(array, target) {
                for (var index = 0; index < array.length; index = index + 1) {
                    var object = array[index];
                    if (this.private.isNumberOrString(object)) {
                        target.push(object);
                    } else {
                        if (object instanceof window.Serializable) {
                            target.push(object.serialize());
                        }
                    }
                }
            },
            serialize: function serialize(object, target) {
                for (var i in object) {
                    var property = object[i];
                    if (this.private.isNumberOrString(property)) {
                        target[i] = object[i];
                    } else if (property instanceof Array) {
                        target[i] = [];
                        this.private.serializeArray(property, target[i]);
                        if (target[i].length === 0) {
                            delete target[i];
                        }
                    }
                }
            }
        };

        this.public = {
            serialize: function serialize() {
                var serialized = {};
                this.private.serialize(this.private, serialized);
                this.private.serialize(this.protected, serialized);
                this.private.serialize(this.public, serialized);
                return serialized;
            }
        };

        this.constructor = function constructor(serialized) {
            this.private.deserialize(serialized);
        };

    });

    /* istanbul ignore else */
    if (window !== undefined) {
        window.Serializable = Serializable;
    } else {
        module.exports = Serializable;
    }
}(this.window,
    this.window ? this.window.clazz :
        /* istanbul ignore next */ require('./ClassFactory.js')));