// EnoFJS 
// Version: 3.0.0
//
// Copyright (c) 2014. 
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
(function SerializableSpecScope() {
    'use strict';

    var clazz = require('./clazz.js');

    describe('Serializable specs', function SerializableSpec() {

        var serializable;
        var serialized;

        beforeEach(function prepareSerialable() {

            var SerializableClass = clazz(function SerialiazableClass() {

                this.extend = 'Serializable';

                this.private = {
                    foo: 123,
                    food: 'hello',
                    fool: ['whazza', 432],
                    foody: {
                        getSet: [
                            {}
                        ]
                    },
                    folly: [],
                    getFoo: function getFoo() {
                        return this.private.foo;
                    }
                };

                this.protected = {
                    bar: 443,
                    barry: 'barry',
                    getBar: function getBar() {
                        return this.protected.bar;
                    }
                };

                this.public = {
                    baz: 'baz',
                    foz: {}
                };

                this.constructor = function constructor() {

                };
            });

            var includedSerializable = new SerializableClass();
            serializable = new SerializableClass();
            serializable.setFoody([includedSerializable]);
            serialized = serializable.serialize();
        });

        it('should serialize the private numbers', function serializePrivateNumbers() {
            expect(serialized.foo).toEqual(123);
        });

        it('should serialize the private strings', function serializePrivateStrings() {
            expect(serialized.food).toEqual('hello');
        });

        it('should serialize the private array', function serializePrivateArray() {
            expect(serialized.fool).toEqual(['whazza', 432]);
        });

        it('should not serialize a private function', function serializeProtectedFunction() {
            expect(serialized.getFoo).not.toBeDefined();
        });

        it('should serialize the object inside of an array if serializeable', function serializablePrivateArray() {
            expect(serialized.foody instanceof Array).toEqual(true);
            expect(serialized.foody[0].foo).toEqual(123);
            expect(serialized.foody[0].food).toEqual('hello');
        });

        it('should not serialize an empty array', function emptyArray() {
            expect(serialized.folly).not.toBeDefined();
            expect(serialized.foody[0].folly).not.toBeDefined();
        });

        it('should serialize the protected numbers', function serializeProtectedNumbers() {
            expect(serialized.bar).toEqual(443);
        });

        it('should serialize the protected strings', function serializeProtectedStrings() {
            expect(serialized.barry).toEqual('barry');
        });

        it('should serialize the public strings', function serializePublicStrings() {
            expect(serialized.baz).toEqual('baz');
        });

        it('should ignore non serializable objects', function ignoreNonSerializable() {
            expect(serialized.foz).not.toBeDefined();
        });
    });

    describe('Deserialize specs', function DeserializeSpec() {

        var deserialized;
        var Hello;

        beforeEach(function prepareDeserialization() {
            var serialized = {
                foo: 123,
                bar: 'bar',
                boz: [
                    {
                        hello: 'world'
                    }
                ]
            };

            var TestDeserializeClass = clazz(function TestDeserializeClass() {

                this.extend = 'Serializable';

                this.private = {
                    foo: {
                        getSet: null
                    },
                    boz: {
                        getSet: null
                    }
                };

                this.protected = {
                    bar: {
                        getSet: null
                    }
                };

                this.constructor = function constructor(serialized) {
                    this.sup(serialized);
                    this.private.boz = this.protected.deserializeArray(serialized.boz, Hello);
                };
            });

            Hello = clazz(function Hello() {

                this.extend = 'Serializable';

                this.private = {
                    hello: {
                        getSet: null
                    }
                };

                this.constructor = function constructor(serialized) {
                    this.sup(serialized);
                };
            });

            deserialized = new TestDeserializeClass(serialized);
        });

        it('should deserialize numbers', function deserializeNumbers() {
            expect(deserialized.getFoo()).toEqual(123);
        });

        it('should deserialize strings', function deserializeStrings() {
            expect(deserialized.getBar()).toEqual('bar');
        });

        it('should deserialize sub objects', function deserializeSubObjects() {
            var boz = deserialized.getBoz();
            expect(boz[0] instanceof Hello);
            expect(boz[0].getHello()).toEqual('world');
        });
    });
}());