EnoFJS
======
Javascript supports private and public out of the box. However
inheritance is often claimed impossible or done with prototype.

While inheriting with prototype is not necessarily bad, it
however implies that all inheritable properties have to be public
and all properties should be public in case a function in the
prototype needs to access it.

Goal
----
EnoFJS is purpose is to make it easy to handle inheritance and
making it visible what the accessibility is of an property.

Support
-------
EnoFJS supports:
 * public scoping
 * private scoping
 * protected scoping
 * extending
 * super access

Examples
--------
Declaring an empty class

    var Animal = clazz(function Animal() {

    });

    var animal = new Animal();
    
Declaring private scope

    var Animal = clazz(function Animal() {
        this.private = {
            privateFoo: 'foo',
            privateBar: function privateBar() {
            }
        };

        this.constructor = function constructor(){
        };
    });
    
Declaring public scope

    var Animal = clazz(function Animal() {
        this.public = {
            publicFoo: 'foo',
            publicBar: function privateBar() {
            }
        };

        this.constructor = function constructor(){
        };
    });

Declaring protected scope

    var Animal = clazz(function Animal() {
        this.protected = {
            protectedFoo: 'foo',
            protectedBar: function privateBar() {
            }
        };

        this.constructor = function constructor(){
        };
    });

Declaring a constructor

    var Animal = clazz(function Animal() {
        this.private = {
            privateFoo: null,
            privateBar: function privateBar() {
            }
        };

        this.constructor = function constructor(foo){
            this.private.foo = foo;
        };
    });

Extending a class

    var Animal = clazz(function Animal() {
        this.private = {
            birthDate: new Date()
        };

        this.protected = {
            formatBirthDate: function formatBirthDate() {
                return this.private.birthDate.toString();
            }
        };

        this.public = {
            getBirthDate: function getBirthDate() {
                return 'I am born at' + this.protected.formatBirthDate();
            };
        };

        this.constructor = function constructor(birthDate){
            if(birthDate instanceof Date){
                this.private.birthDate = birthDate;
            }
        };
    });

    var Dog = clazz(function Dog() {
        this.extend = 'Animal';

        this.constructor = function(birthDate){
            this.super.constructor(birthDate);
        };
    });

    var dog = new Dog(new Date());

For more details take a look at the [ClassFactorySpec](test/spec/ClassFactorySpec.js)
