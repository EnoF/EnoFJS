/**
 * Define a class
 * @param {String} namespace
 * @param {Function} classDefinition
 */
function Class(namespace, classDefinition, classConstants){
	var _Instance,
		/**
		 * the name space split into resolvable pieces
		 * @type {Array:String}
		 */
		_nameSpace = namespace.split('.'),
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
	
	/**
	 * Check if the class doesn't exist already
	 * @throws Class already exists
	 */
	if(_currentNameSpace[_className]){
		throw {
			message : "Class already exists",
			reason : "Class " + className + " already exists"
		};
	}
    
    /**
     * new Class constructor
     */
    _Instance = _currentNameSpace[_className] = function(){
        /**
         * Class representable
         * This is the representable class, this will allow us to extend in the future
         * @type {Class}
         */
        var _class = {};
        
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
        classDefinition.call(this);
        
        // The constants can't be adjusted once created
        if(Object.freeze){
        	Object.freeze(_Instance);
        }
        // Remove the class creation methods from the created Class
        // We don't want to polute the classes we make
        delete this.privateProperty;
        delete this.publicProperty;
        delete this.privateMethod;
        delete this.publicMethod;
    };
    
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
