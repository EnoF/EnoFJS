
//      EnoFJS v1.1.3

//      Copyright (c) 2014.
//
//      Author Andy Tang
//      Fork me on Github: https://github.com/EnoF/EnoFJS
(function ClassScope(window) {
    'use strict';

    // A map containing all classes registered to the ClassFactory.
    // These classes are the original classes.
    var registeredClasses = {};
    // A map containing all generated classes.
    // We will use this to look up and manage the dependency of the super scope.
    var registeredEnoFJSClasses = {};

    // Wrap up a given class into an EnoFJS class.

    //      clazz(function Animal(){
    //          ...
    //      });
    window.clazz = function clazz(NewClass) {
        var className = NewClass.extractFunctionName();

        registeredClasses[className] = NewClass;

        // This is the class generated out of the `NewClass`.
        // The original class will be initialized and will generate the scope for this
        // generated EnoFJS class.
        function EnoFJSClass() {
            var newClass = new NewClass();
            var instanceScope = generateClassScope(this, newClass);

            // Apply the original constructor with any given arguments.
            // This allows the user to pass on parameters in the constructor without any additional calls.

            //      clazz(function Animal(name, age){
            newClass.constructor.apply(instanceScope, arguments);
        }

        // Check if the instance is extending any other class.
        // If it is extending, make sure to set the prototype accordingly.
        // This allows for type checking!

        //      var kitten = new Kitten();
        //      expect(kitten instanceof Animal).toEqual(true);
        var instance = new NewClass();
        if (instance.extend !== undefined) {
            EnoFJSClass.prototype = new registeredEnoFJSClasses[instance.extend]();
        }

        // Register the generated class so that it can be used as a reference for an extending class.
        registeredEnoFJSClasses[className] = EnoFJSClass;

        // Return the newly generated class to be used :)
        return EnoFJSClass;
    };

    // Generate the an scope from the newly instantiated class.
    // This scope will be bound to the functions, so they will be able to access the private,
    // and protected scope.
    function generateClassScope(scope, newClass) {
        // Generate the base scope with the class this scope is extending from.
        var instanceScope = getExtend(newClass);

        generateInstanceScopeMembers(instanceScope, instanceScope.private, newClass.private);
        generateInstanceScopeMembers(instanceScope, instanceScope.protected, newClass.protected);
        generateInstanceScopeMembers(instanceScope, instanceScope.public, newClass.public);

        generateInstanceScopeMembers(instanceScope, scope, newClass.public);

        return instanceScope;
    }

    // Normalizing the instance in order to skip checks in the future.
    // *TODO: The constructor should be normalized as well!
    // Currently all classes need to implement the constructor, even if they would only use the default
    // constructor!*

    //      clazz(function Animal(){
    //          this.constructor = function constructor(){
    //              // empty
    //          };
    //      });
    function normalizeInstance(instance) {
        instance.private = instance.private || {};
        instance.protected = instance.protected || {};
        instance.public = instance.public || {};
        instance.super = instance.super || {};
    }

    // This function will call itself to retrieve the scope of all the ancestors merged together.
    function getExtend(instance) {
        normalizeInstance(instance);
        if (instance.extend !== undefined) {
            var parent = getExtend(new registeredClasses[instance.extend]());
            extendParent(instance, parent);
        }

        // Return the merged scope after all the parent scopes have been resolved.
        return instance;
    }

    // Merge the given child scope with the parent scope.
    // The parent scope is retrieved by an instance of the original parent class,
    // therefore the parent scope functions are still without any scope modifications.
    function extendParent(childScope, parentInstance) {
        var parentInstanceScope = {
            private: parentInstance.private,
            protected: parentInstance.protected,
            public: parentInstance.public,
            super: parentInstance.super
        };

        // Generate the members of the parent and register the function on the super
        // scope of the child.
        generateInstanceScopeMembers(parentInstanceScope, parentInstanceScope.private, parentInstance.private,
            childScope.super);
        generateInstanceScopeMembers(parentInstanceScope, parentInstanceScope.protected, parentInstance.protected,
            childScope.super);
        generateInstanceScopeMembers(parentInstanceScope, parentInstanceScope.public, parentInstance.public,
            childScope.super);

        // The constructor of the parent should have the scope of the parent.
        childScope.super.constructor = modifyFunctionScope(parentInstanceScope, parentInstance.constructor);

        // Merge the parents protected members and public members with the child scope.
        // The private scope is not merged, because the private scope is only accessible
        // at the defined scope.
        mergeAndOverrideParent(childScope, childScope.protected, parentInstanceScope.protected);
        mergeAndOverrideParent(childScope, childScope.public, parentInstanceScope.public);
    }

    // Extract the function name so we can use this to determine the name of the class
    // we want to register. By extracting the name of the function, the registration of the class
    // doesn't require a string to be passed on as a parameter.
    Function.prototype.extractFunctionName = function extractFunctionName() {
        var functionName = this.toString();
        functionName = functionName.substr('function '.length);
        functionName = functionName.substr(0, functionName.indexOf('('));
        return functionName;
    };

    // The specific scope, private, protected or public will be copied from the original
    // instance to the instance object. The functions will have the entire scope as an
    // `this` scope.
    function generateInstanceScopeMembers(scope, thisInstanceScope, members, superScope) {
        for (var member in members) {
            if (!members.hasOwnProperty(member)) {
                continue;
            }
            var memberValue = members[member];

            // Depending on what type of value the currently iterated member has,
            // the value will be modified accordingly.

            // If the value is an `Object` with the property the value:
            // `get`, `set`, `getSet`, `is` or `isSet`,
            // a `getter`, `setter` and/or `is` is generated.
            // The original `Object` is replaced with the value of the `attribute`.

            //      this.private = {
            //          foo: {
            //              get: 'value'
            //          }
            //      };
            //      this.protected = {
            //          bar: {
            //              isSet: 'value'
            //          }
            //      };
            if (memberValue instanceof Object &&
                (hasGet(memberValue) || hasSet(memberValue) || hasIs(memberValue))) {
                generateAutoGetSet(scope, thisInstanceScope, member, memberValue);
            }
            // If the value is an `function` on either the `private`, `protected` or `public`,
            // the function is bound with the scope `Object` as the `this` scope.

            //      this.private = {
            //          foo: function foo(){
            //              return 'bar';
            //          }
            //      };
            else if (typeof memberValue === 'function') {
                thisInstanceScope[member] = modifyFunctionScope(scope, memberValue);
            }
            // If the value is neither, the value is copied onto the scope.

            //      this.private = {
            //          foo: 123,
            //          bar: null
            //      };
            else {
                thisInstanceScope[member] = memberValue;
            }
            // If `superScope` is defined, it means we are currently extending a parent.
            // So lets make this member available for the extender via the `super` scope.
            if (superScope instanceof Object) {
                superScope[member] = thisInstanceScope[member];
            }
        }
    }

    // Modify the scope of a function so the this scope will always have access
    // to the scope `Object`. This is what makes it possible to call members within
    // a function of a class.

    //      this.public = {
    //          getFoo: function getFoo(){
    //              return this.private.foo;
    //          }
    //      };
    function modifyFunctionScope(scope, memberFunction) {
        return function modifiedScopeFunction() {
            return memberFunction.apply(scope, arguments);
        };
    }

    // Merge the extending instance with the parent instance.
    // The child instance will override any existing members of the parent.
    // Any member the parent has, but the child do not have, will be added to the child scope.
    // If the parent is overridden, the scope will be modified to the child scope.
    function mergeAndOverrideParent(scope, child, parent) {
        for (var member in parent) {
            if (parent.hasOwnProperty(member) && !child.hasOwnProperty(member)) {
                child[member] = parent[member];
            } else if (parent.hasOwnProperty(member) && child.hasOwnProperty(member) &&
                typeof child[member] === 'function') {
                parent[member] = modifyFunctionScope(scope, child[member]);
            } else if (parent.hasOwnProperty(member) && child.hasOwnProperty(member)) {
                parent[member] = child[member];
            }
        }
    }

    // **Getters, Setters and Issers**

    // `get || getSet`
    function hasGet(value) {
        return value.hasOwnProperty('get') || value.hasOwnProperty('getSet');
    }

    // `set || getSet || isSet`
    function hasSet(value) {
        return value.hasOwnProperty('set') || value.hasOwnProperty('getSet') ||
            value.hasOwnProperty('isSet');
    }

    // `is || isSet`
    function hasIs(value) {
        return value.hasOwnProperty('is') || value.hasOwnProperty('isSet');
    }

    // The generated `getter` put on the public scope.

    //      var Animal = clazz(function Animal(){
    //          this.private = {
    //              foo: {
    //                  get: 'bar'
    //          ...
    //      });
    //
    //      var animal = new Animal();
    //      expect(animal.getFoo()).toEqual('bar');
    function generateAutoGet(scope, thisInstanceScope, member) {
        var getter = ('get' + member.capitaliseFirstLetter());
        scope.public[getter] = function generatedGet() {
            return thisInstanceScope[member];
        };
    }

    // The generated `setter` put on the public scope.

    //      var Animal = clazz(function Animal(){
    //          this.protected = {
    //              foo: {
    //                  getSet: 'bar'
    //          ...
    //      });
    //
    //      var animal = new Animal();
    //      expect(animal.getFoo()).toEqual('bar');
    //      animal.setFoo('foobar');
    //      expect(animal.getFoo()).toEqual('foobar');
    function generateAutoSet(scope, thisInstanceScope, member) {
        var setter = ('set' + member.capitaliseFirstLetter());
        scope.public[setter] = function generatedSet(newValue) {
            thisInstanceScope[member] = newValue;
        };
    }

    // The generated `isser` put on the public scope.

    //      var Animal = clazz(function Animal(){
    //          this.private = {
    //              foo: {
    //                  isSet: true
    //          ...
    //      });
    //
    //      var animal = new Animal();
    //      expect(animal.isFoo()).toEqual(true);
    //      animal.setFoo(false);
    //      expect(animal.isFoo()).toEqual(false);
    function generateAutoIs(scope, thisInstanceScope, member) {
        var is = ('is' + member.capitaliseFirstLetter());
        scope.public[is] = function generatedIs() {
            return thisInstanceScope[member];
        };
    }

    // The property set has five different possibilities.
    // To make sure the members can contain objects, get the default value of only
    // the `get`, `set`, `is`, `getSet` or `isSet`
    function getDefaultValue(value) {
        if (value.hasOwnProperty('get')) {
            return value.get;
        } else if (value.hasOwnProperty('set')) {
            return value.set;
        } else if (value.hasOwnProperty('is')) {
            return value.is;
        } else if (value.hasOwnProperty('isSet')) {
            return value.isSet;
        } else {
            return value.getSet;
        }
    }


    // Generate an `getter`, `setter` and/or `isser` for a given member.
    // Set the default value after generating the functions!
    function generateAutoGetSet(scope, thisInstanceScope, member, value) {
        if (hasGet(value)) {
            generateAutoGet(scope, thisInstanceScope, member);
        } else if (hasIs(value)) {
            generateAutoIs(scope, thisInstanceScope, member);
        }
        if (hasSet(value)) {
            generateAutoSet(scope, thisInstanceScope, member);
        }
        thisInstanceScope[member] = getDefaultValue(value);
    }

    // To easily camel case our generated functions :)
    String.prototype.capitaliseFirstLetter = function capitaliseFirstLetter() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
}(window));
