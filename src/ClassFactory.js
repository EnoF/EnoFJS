//      EnoFJS v1.1.4

//      Copyright (c) 2014.
//
//      Author Andy Tang
//      Fork me on Github: https://github.com/EnoF/EnoFJS
(function ClassScope(window, undefined) {
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

        return parseToPrototypedClass(className, NewClass);
    };

    // Parse a normal class into a Prototyped Class.
    function parseToPrototypedClass(className, NewClass) {

        var instance = normalizeInstance(new NewClass());

        // Generate Getters and Setters into the prototype.
        generateAutoIsGetSet('private', instance.private, instance.public);
        generateAutoIsGetSet('protected', instance.protected, instance.public);

        if (instance.extend !== undefined) {
            // Merge the parent properties into this instance.
            var parent = registeredClasses[instance.extend];
            var parentProto = extendParent(instance, parent);
        }

        // Create a prototyped class based on the instance.
        var PrototypedClass = createProtoClass(instance, parent);

        if (instance.extend !== undefined) {
            // Create cross references for the extended members.
            crossReferenceExtendedMembers(PrototypedClass, parentProto);
        }

        // Register the new PrototypedClass for future extension.
        registeredClasses[className] = PrototypedClass;

        // Create a new EnoFJSClass out of the PrototypedClass.
        return createNewEnoFJSClass(className, PrototypedClass);
    }

    function extendParent(instance, parent) {
        // Create a new scope of the Private, Protected and Public,
        // so that the instances won't clash.
        var parentProto = {
            private: new parent.Private(),
            protected: new parent.Protected(),
            public: new parent.Public(),
            constructor: parent.constructor
        };
        // Merge the missing members of the parent into this class.
        mergeParentIntoChild(parentProto.private, instance.private);
        mergeParentIntoChild(parentProto.protected, instance.protected);
        mergeParentIntoChild(parentProto.public, instance.public);
        return parentProto;
    }

    function createProtoClass(instance, parent) {
        // For each scope, we need to create a new instance. Otherwise it will clash when the
        // class is instantiated multiple times!
        function Private() {
        }

        Private.prototype = instance.private;

        function Protected() {
        }

        Protected.prototype = instance.protected;

        function Public() {
        }

        Public.prototype = instance.public;

        // The Prototyped Class Object.
        var PrototypedClass = {
            extend: instance.extend,
            constructor: instance.constructor,
            super: parent !== undefined ? parent.constructor : function () {
            },
            Private: Private,
            Protected: Protected,
            Public: Public
        };
        return PrototypedClass;
    }

    function crossReferenceExtendedMembers(PrototypedClass, parentProto) {
        // Each scope can only access the parent's same scope.
        PrototypedClass.Private.prototype.super = parentProto.private;
        PrototypedClass.Protected.prototype.super = parentProto.protected;
        PrototypedClass.Public.prototype.super = parentProto.public;

        // The references should be referenced to this instance, rather than the parent instance.
        createCrossReference(PrototypedClass, PrototypedClass.Private.prototype.super);
        createCrossReference(PrototypedClass, PrototypedClass.Private.prototype.super);
        createCrossReference(PrototypedClass, PrototypedClass.Public.prototype.super);
    }

    // Generate is, get and setters. You can combine the `get` or `is` with the `set`.
    // i.e. `getSet` or `isSet`.

    //     this.private = {
    //         foo: {
    //             get: 'value'
    //         },
    //         bar: {
    //             is: true
    //         },
    //         baz: {
    //             getSet: 'value'
    //         }
    //     }
    function generateAutoIsGetSet(scopeName, members, publicScope) {
        for (var member in members) {
            var autoProperty = members[member];
            var getter = false;
            var isser = false;
            var capitalizedMemberName = member.capitaliseFirstLetter();
            if (!(autoProperty instanceof Object)) {
                continue;
            }
            if (hasGet(autoProperty)) {
                // Set the value on the member, when it was a getSet, it will be set later on.
                members[member] = autoProperty.get;
                // Generate a getter.
                publicScope['get' + capitalizedMemberName] = generateAutoGet(scopeName, member);
                getter = true;
            } else if (hasIs(autoProperty)) {
                // Set the value on the member, when it was a isSet, it will be set later on.
                members[member] = autoProperty.is;
                // Generate an isser.
                publicScope['is' + capitalizedMemberName] = generateAutoIs(scopeName, member);
                isser = true;
            }
            if (hasSet(autoProperty)) {
                // Set the value on the member, depending if it is a set, getSet or isSet.
                if (getter) {
                    members[member] = autoProperty.getSet;
                } else if (isser) {
                    members[member] = autoProperty.isSet;
                } else if (autoProperty.hasOwnProperty('set')) {
                    members[member] = autoProperty.set;
                }

                // Generate a setter.
                publicScope['set' + capitalizedMemberName] = generateAutoSet(scopeName, member);
            }
        }
    }

    // Generate a getter.
    function generateAutoGet(scopeName, member) {
        return function autoGet() {
            return this[scopeName][member];
        };
    }

    // Generate a isser.
    function generateAutoIs(scopeName, member) {
        return function autoIs() {
            return this[scopeName][member];
        };
    }

    // Generate a setter.
    function generateAutoSet(scopeName, member) {
        return function autoSet(value) {
            this[scopeName][member] = value;
        };
    }

    // Merge parent functions into child scope.
    function mergeParentIntoChild(parent, child) {
        for (var member in parent) {
            if (!child.hasOwnProperty(member)) {
                child[member] = parent[member];
            }
        }
    }

    // Make public functions available in the `this` scope.
    function publish(scope, publicMembers) {
        for (var member in publicMembers) {
            scope[member] = publicMembers[member];
        }
    }

    // Create a new EnoFJS class.
    function createNewEnoFJSClass(className, PrototypedClass) {

        function EnoFJSClass() {
            // Instantiate the Prototyped Class.
            var instance = {
                private: new PrototypedClass.Private(),
                protected: new PrototypedClass.Protected(),
                public: new PrototypedClass.Public(),
                constructor: PrototypedClass.constructor,
                super: PrototypedClass.super
            };

            // Create references from scope to scope.
            createCrossReference(instance, instance.private);
            createCrossReference(instance, instance.protected);
            createCrossReference(instance, instance.public);

            // Merge the public object into the this of the EnoFJS class.
            publish(this, instance.public);
            // Trigger the constructor.
            instance.constructor.apply(instance, arguments);
        }

        // Make the class related to the parent.

        //    Dog instanceof Animal === true;
        if (PrototypedClass.extend !== undefined) {
            EnoFJSClass.prototype = new registeredEnoFJSClasses[PrototypedClass.extend]();
        }

        // Register the EnoFJS class so we can extend from it.
        registeredEnoFJSClasses[className] = EnoFJSClass;

        return EnoFJSClass;
    }

    function createCrossReference(referenceObject, instanceScope) {
        // The reference object can be an instance or the PrototypeClass.
        instanceScope.private = referenceObject.private || referenceObject.Private.prototype;
        instanceScope.protected = referenceObject.protected || referenceObject.Protected.prototype;
        instanceScope.public = referenceObject.public || referenceObject.Public.prototype;
    }

    // Normalizing the instance in order to skip checks in the future.
    function normalizeInstance(instance) {
        instance.private = instance.private || {};
        instance.protected = instance.protected || {};
        instance.public = instance.public || {};
        instance.super = instance.super || {};
        instance.constructor = instance.constructor ||
            function constructor() {
            };
        return instance;
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

    // To easily camel case our generated functions :)
    String.prototype.capitaliseFirstLetter = function capitaliseFirstLetter() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
}(window));