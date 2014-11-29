// EnoFJS 
// Version: 3.2.0
//
// Copyright (c) 2014. 
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
(function SerializableScope(enofjs) {
    'use strict';

    function Serializable() {

        this.private = {
            // Deserialization for the private and protected variables.
            // `public` properties are not supported, use `getters` and `setters` instead!
            deserialize: function deserialize(serialized) {
                for (var i in serialized) {
                    if (i in this.protected) {
                        this.protected[i] = serialized[i];
                    } else if (i in this.private) {
                        this.private[i] = serialized[i];
                    }
                }
            },
            // Serialize a specific scope onto an new target object.
            serialize: function serialize(scope, target) {
                for (var i in scope) {
                    var property = scope[i];
                    if (this.private.isNumberOrString(property)) {
                        // Serialize the property directly if it is a `String` or `Number`.
                        target[i] = scope[i];
                    } else if (property instanceof Array) {
                        // When it is an Array, serialize it with the serializeArray helper.
                        target[i] = [];
                        this.private.serializeArray(property, target[i]);
                        if (target[i].length === 0) {
                            delete target[i];
                        }
                    }
                }
            },
            // Return if the provided property is either a number or string.
            isNumberOrString: function isNumberOrString(property) {
                var type = typeof property;
                return type === 'number' || type === 'string';
            },
            // Serializing the array into a target array.
            serializeArray: function serializeArray(array, target) {
                for (var index = 0; index < array.length; index = index + 1) {
                    var object = array[index];
                    if (this.private.isNumberOrString(object)) {
                        // When the value is a `String` or `Number` proceed to serialize.
                        target.push(object);
                    } else if (object instanceof InnerSerializableReference) {
                        // When the value is Serializable, serialize the object first.
                        target.push(object.serialize());
                    }
                }
            }
        };

        this.protected = {
            // Deserializing arrays is only necessary when the value is Serialized.
            // In that case use `deserializeArray` and provide the correct `Class` to
            // deserialize the value to.
            deserializeArray: function deserializeArray(serializedArray, Clazz) {
                var deserializedArray = [];
                for (var i = 0; i < serializedArray.length; i++) {
                    var serializedObject = serializedArray[i];
                    deserializedArray[i] = new Clazz(serializedObject);
                }
                return deserializedArray;
            }
        };

        this.public = {
            serialize: function serialize() {
                var serialized = {};
                // Serialize all scopes into a new serialized object.
                this.private.serialize(this.private, serialized);
                this.private.serialize(this.protected, serialized);
                this.private.serialize(this.public, serialized);
                return serialized;
            }
        };

        this.constructor = function constructor(serialized) {
            this.private.deserialize(serialized);
        };

    }

    var SerializableClass = enofjs.clazz(Serializable);
    var InnerSerializableReference = SerializableClass;

    enofjs.SerializableClass = SerializableClass;
}(window.enofjs));