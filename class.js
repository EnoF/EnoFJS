/**
 * Define a class
 * @param {String} className
 * @param {Function} classDefinition
 */
function Class(className, classDefinition){
    window[className] = function(){
        var _private = {};
        
        this.privateProperty = function(type, property, value){
            var _invalidValue = false;
            if(typeof(type) === "string"){
                if(typeof(value) !== type){
                    _invalidValue = true;
                }
            }else if(!value instanceof type){
                _invalidValue = true
            }
            if(_invalidValue){
                throw {
                    message : "Type Reference Error",
                    reason : "Default value " + value + " is not an instance of " + type
                };
            }else{
                _private[property] = value;
            }
        };
        
        this.privateMethod = function(methodName, method){
            _private[methodName] = function(){
                return method.apply(_private, arguments);
            };
        };
        
        this.publicMethod = function(methodName, method){
            _private[methodName] = (this[methodName] = function(){
                return method.apply(_private, arguments);
            });
        };
        
        classDefinition.call(this);
        
        delete this.privateMethod;
        delete this.privateBoolean;
        delete this.publicMethod;
    };
}
