/*
 * Copyright (c) 2014. 
 *
 * @Author Andy Tang
 */
(function ClassScope(window) {
    'use strict';

    /**
     * A map containing all generated classes, this is necessary for looking up the Super class
     * @type {Object}
     * @key {String} ClassName
     * @value {Function} OriginalClass
     */
    var registeredClasses = {};

    /**
     * A class factory, the new class will be stripped of
     * [this.extend, this.private, this.protected, this.public]
     *
     * The variables will then be attached with the correct privacy
     *
     * @param NewClass The Class that has to be generated
     * @returns {EnoFJSClass} A generated class
     */
    window.clazz = function clazz(NewClass) {
        var className = extractClassName(NewClass);

        registeredClasses[className] = NewClass;

        /**
         * A wrapper class
         * @constructor
         */
        function EnoFJSClass() {
            var newClass = new NewClass();
            var instanceScope = generateClassScope(this, newClass);

            newClass.constructor.apply(instanceScope, arguments);
        }

        return EnoFJSClass;
    };

    /**
     * Generate the Class on the instance scope
     *
     * @param scope the scope these members has to be applied to
     * @param newClass the instance of the class that has to be generated
     * @returns {Object} the class scope
     */
    function generateClassScope(scope, newClass) {
        var instanceScope = {
            private: newClass.private,
            protected: newClass.protected,
            public: newClass.public
        };
        if (newClass.extend !== undefined) {
            var parentInstance = new registeredClasses[newClass.extend]();
            var parentInstanceScope = {
                private: parentInstance.private,
                protected: parentInstance.protected,
                public: parentInstance.public
            };
            instanceScope.super = {};

            generateInstanceScopeMembers(parentInstanceScope, parentInstanceScope.private, parentInstance.private,
                instanceScope.super);
            generateInstanceScopeMembers(parentInstanceScope, parentInstanceScope.protected, parentInstance.protected,
                instanceScope.super);
            generateInstanceScopeMembers(parentInstanceScope, parentInstanceScope.public, parentInstance.public,
                instanceScope.super);

            instanceScope.super.constructor = modifyFunctionScope(parentInstanceScope, parentInstance.constructor);

            mergeAndOverrideParent(instanceScope.protected, parentInstanceScope.protected);
            mergeAndOverrideParent(instanceScope.public, parentInstanceScope.public);
        }

        generateInstanceScopeMembers(instanceScope, instanceScope.private, newClass.private);
        generateInstanceScopeMembers(instanceScope, instanceScope.protected, newClass.protected);
        generateInstanceScopeMembers(instanceScope, instanceScope.public, newClass.public);

        generateInstanceScopeMembers(instanceScope, scope, newClass.public);

        return instanceScope;
    }

    /**
     * Extract the class name from a function
     * @param NewClass the new class to be generated
     * @returns {String}
     */
    function extractClassName(NewClass) {
        var NewClassName = NewClass.toString();
        NewClassName = NewClassName.substr('function '.length);
        NewClassName = NewClassName.substr(0, NewClassName.indexOf('('));
        return NewClassName;
    }

    /**
     * Generate the members of the provided class onto the generated class
     *
     * @param scope The scope that will be available for the functions to use
     * @param thisInstanceScope The instance scope where the new member will be applied to
     * @param members The members which has to be applied on the new instance scope
     * @param isPublic Indicate if the members should be publicly available
     * @param superScope If the superScope is provided, the members will also be applied
     *        on the super scope
     */
    function generateInstanceScopeMembers(scope, thisInstanceScope, members, superScope) {
        for (var member in members) {
            if (!members.hasOwnProperty(member)) {
                continue;
            }
            if (typeof members[member] === 'function') {
                thisInstanceScope[member] = modifyFunctionScope(scope, members[member]);
            } else {
                thisInstanceScope[member] = members[member];
            }
            if (superScope instanceof Object) {
                superScope[member] = thisInstanceScope[member];
            }
        }
    }

    /**
     * Modifies the scope of an function
     *
     * @param scope The scope that is available for this function
     * @param memberFunction The function that has to be modified
     * @returns {modifiedScopeFunction}
     */
    function modifyFunctionScope(scope, memberFunction) {
        return function modifiedScopeFunction() {
            return memberFunction.apply(scope, arguments);
        };
    }

    /**
     * Merge an object with an other object. The child object will
     * override any attribute with the same name from the parent
     *
     * @param child {Object}
     * @param parent {Object}
     */
    function mergeAndOverrideParent(child, parent) {
        for (var member in parent) {
            if (parent.hasOwnProperty(member) && !child.hasOwnProperty(member)) {
                child[member] = parent[member];
            }
        }
    }
}(window));
