/**
 * Define a class
 * @param {String} namespace
 * @param {Function} classDefinition
 * @param {Function} classConstants
 */
function Class(namespace, classDefinition, classConstants){
	var _Instance,
		_resolvedNameSpace = resolveNameSpace(namespace),
		_currentNameSpace = _resolvedNameSpace.currentNameSpace,
		_currentClass = _resolvedNameSpace.currentClass;
	
	/**
	 * Check if the class doesn't exist already
	 * @throws Class already exists
	 */
	if(_currentNameSpace[_currentClass]){
		throw {
			message : "Class already exists",
			reason : "Class " + _currentClass + " already exists"
		};
	}
    
    /**
     * new Class constructor
     */
    _Instance = _currentNameSpace[_currentClass] = function(){
        /**
         * Class representable
         * This is the representable class, this will allow us to extend in the future
         * @type {Class}
         */
        var _class = {},
        	_protected = {};
        
        /**
         * Expose the class and protected in order to make the extention of this class possible
         * @FIXME need a more elegant solution for this... But at this moment I have no idea how to do this
         * more elegantly
         * the properties will be deleted after the extention of the class
         */
        this.expose = function(){
        	this.class = _class;
        	this.protected = _protected;
        };
        
        /**
         * Import a class to this class
         * The class will be made available with this.class
         */
        this.import = function(namespace){
        	var _resolvedNameSpace = resolveNameSpace(namespace),
				_currentNameSpace = _resolvedNameSpace.currentNameSpace,
				_currentClass = _resolvedNameSpace.currentClass;
				
			this[_currentClass] = _currentNameSpace[_currentClass];
        };
        
        /**
         * Extends a class
         * @param extendClass the class this class should extend
         */
        this.extends = function(extendClass){
        	var _extendClass = new extendClass();
        	
        	_extendClass.expose();
        	
        	_extendClass.extend = function(newClass){
	        	var _publicPropOrFunc;
	        	
	        	newClass.addExtendedPrivates(this.class);
	        	
	        	newClass.addExtendedProtected(this.protected);
	        	
	        	delete _extendClass.extend;
	        	/**
	        	 * @FIXME Delete the class and protected 
	        	 */
	        	delete _extendClass.class;
	        	delete _extendClass.protected;
	        	
	        	for(_publicPropOrFunc in this){
	        		newClass[_publicPropOrFunc] = this[_publicPropOrFunc];
	        	}
	        };
        	
        	_extendClass.extend(this);
        	delete this.extends;
        };
        
        /**
         * To make sure the _privates are only used within this block of code
         * This block of code is to make the protected and private funcs/props
         * available in the extending class
         */
        (function(self){
        	var _privates = {};
        	
        	/**
	         * Add the private variables to this class
	         * @param {Object} the private variables of the extending class
	         */
	        self.addExtendedPrivates = function(privates){
	        	var _propOrFunc,
	        		_currentPropOrFunc;
	        	
	        	for(_propOrFunc in privates){
	        		_currentPropOrFunc = privates[_propOrFunc];
	        		if(typeof(_currentPropOrFunc) === "function"){
	        			(function(func){
		        			_privates[func] = function(){
		        				return privates[func].apply(_privates, arguments);
		        			};
	        			}(_propOrFunc));
	        		}else{
	        			_privates[_propOrFunc] = privates[_propOrFunc];
	        		}
	        	}
	        };
	        
	        /**
	         * Add the protected variables and functions to this class
	         * @param {Object} the protected variables and functions of the extending class
	         */
	        self.addExtendedProtected = function(protected){
	        	var _propOrFunc,
	        		_currentPropOrFunc;
	        	for(_propOrFunc in protected){
	        		_currentPropOrFunc = protected[_propOrFunc];
	        		if(typeof(_currentPropOrFunc) === "function"){
	        			(function(func){
		        			_protected[func] = _class[func] = _privates[func] = function(){
		        				return protected[func].apply(_privates, arguments);
		        			};
	        			}(_propOrFunc));
	        		}else{
	        			_protected[_propOrFunc] = _class[_propOrFunc] = _privates[_propOrFunc] = protected[_propOrFunc];
	        		}
	        	}
	        };
        }(this));
        
        
        /**
         * Create a private property
         * Set this property into the class representable
         * @param {String|Class} type The type of the property
         * @param {String} property The name of the property
         * @param {Object} value The value of the property
         * @return {Object} returns the value
         */
        this.privateProperty = function(type, property, value){
    		isOfType(value, type);
    		return _class[property] = value;
        };
        
        /**
         * Create a protected property
         * Set this property into the class representable
         * @param {String|Class} type The type of the property
         * @param {String} property The name of the property
         * @param {Object} value The value of the property
         * @return {Object} returns the value
         */
        this.protectedProperty = function(type, property, value){
    		_protected[property] = this.privateProperty(type, property, value);
        };
        
        /**
         * Create a public property 
         * Uses the privateProperty function to set it into the class representable
         * @param {String|Class} type The type of the property
         * @param {String} property The name of the property
         * @param {Object} value The value of the property
         */
        this.publicProperty = function(type, property, value){
    		this[property] = this.privateProperty(type, property, value);
        };
        
        /**
         * Create a private method
         * Set this method into the class representable
         * @param {String|Class} type The type of the property
         * @param {String} property The name of the property
         * @param {Object} value The value of the property
         * @return {Object} returns the value of the function
         */
        this.privateMethod = function(returnType, methodName, method){
            return _class[methodName] = function(){
                var _returnValue = method.apply(_class, arguments);
                
                isOfType(_returnValue, returnType);
                
                return _returnValue;
            };
        };
        
        /**
         * Create a protected method
         * Set this method into the class representable
         * @param {String|Class} type The type of the property
         * @param {String} property The name of the property
         * @param {Object} value The value of the property
         * @return {Object} returns the value of the function
         */
        this.protectedMethod = function(returnType, methodName, method){
        	_protected[methodName] = this.privateMethod(returnType, methodName, method);
        };
        
        /**
         * Create a public method
         * Uses the privateMethod function to set it into the class representable
         * Forwards the privateMethod into the this scope
         * @param {String|Class} type The type of the property
         * @param {String} property The name of the property
         * @param {Object} value The value of the property
         */
        this.publicMethod = function(returnType, methodName, method){
            this[methodName] = this.privateMethod(returnType, methodName, method);
        };
        
        // Set the this object for the class definition
        classDefinition.apply(this, arguments);
        
        // The constants can't be adjusted once created
        if(Object.freeze){
        	Object.freeze(_Instance);
        }
        // Remove the class creation methods from the created Class
        // We don't want to polute the classes we make
        delete this.import;
        delete this.addExtendedProtected;
    	delete this.addExtendedPrivates;
    	delete this.protectedMethod;
    	delete this.privateProperty;
        delete this.privateProperty;
        delete this.publicProperty;
        delete this.privateMethod;
        delete this.publicMethod;
    };
    
    /**
     * Resolve the name space
     * @param {String} namespace
     * @return {Object} returns the namespace and the class
     */
    function resolveNameSpace(namespace){
    	/**
		 * the name space split into resolvable pieces
		 * @type {Array:String}
		 */
		var _nameSpace = namespace.split('.'),
		/**
		 * the key for the namespace loop
		 * @type {String}
		 */
		_ns,
		/**
		 * the pointer for our namespace
		 * @type {Object}
		 */
		_currentNameSpace = this,	
		/** 
		 * the last entry of our namespace is our class name 
		 * @type {String}
		 */
		_className = _nameSpace.pop();
	
		/**
		 * Resolve the namespace
		 */
		for(_ns in _nameSpace){
			if(typeof(_currentNameSpace[_nameSpace[_ns]]) === "undefined"){
				_currentNameSpace[_nameSpace[_ns]] = {};
			}
			_currentNameSpace = _currentNameSpace[_nameSpace[_ns]];
		}
		return {
			currentNameSpace : _currentNameSpace,
			currentClass : _className
		};
    }
    
    /**
     * Check if the value is of the given type
	 * @param {String|Class} value The value to be validated
	 * @param {Object} type The type the value should be
	 * @throws Type Reference Error
     */
    function isOfType(value, type){
    	if(typeof(type) === "string"){
			if(typeof(value) !== type){
				throw {
					message : "Type Reference Error",
					reason : "Default value " + value + " is not of type " + type
				};
			}
		}else if(!value instanceof type){
			throw {
				message : "Type Reference Error",
				reason : "Default value " + value + " is not an instance of " + type
			}
		}
    }
    
    /**
     * Instantiate the constants
     */
    (function(){
    	/**
         * Create a constants
         * The constants will be bound to the Class
         * @param {String|Class} type The type of the property
         * @param {String} property The name of the property
         * @param {Object} value The value of the property
         */
	    this.constants = function(type, constName, value){
			isOfType(value, type); 
			_Instance[constName] = value;
		};
	    
	    // only create constants if required
	    if(typeof(classConstants) === 'function'){
	    	classConstants.call(this);
	    }
    }());
}
