/**
 * Define a class
 * @param {String} className
 * @param {Function} classDefinition
 */
function Class(className, classDefinition){
    window[className] = function(){
        /**
         * class representable
         * This is the representable class, this will allow us to extend in the future
         * @type {Class}
         */
        var _class = {};
        
        /**
         * Check if the value is of the given type
		 * @param {String|Class} value
		 * @param {Object} type
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
        
        this.privateProperty = function(type, property, value){
    		isOfType(value, type);
    		return _class[property] = value;
        };
        
        this.publicProperty = function(type, property, value){
    		this[property] = this.privateProperty(type, property, value);
        };
        
        this.privateMethod = function(returnType, methodName, method){
            return _class[methodName] = function(){
                var _returnValue = method.apply(_class, arguments);
                
                isOfType(_returnValue, returnType);
                
                return _returnValue;
            };
        };
        
        this.publicMethod = function(returnType, methodName, method){
            this[methodName] = this.privateMethod(returnType, methodName, method);
        };
        
        // Set the this object for the class definition
        classDefinition.call(this);
        
        // Remove the class creation methods from the created Class
        delete this.privateProperty;
        delete this.publicProperty;
        delete this.privateMethod;
        delete this.publicMethod;
    };
}
