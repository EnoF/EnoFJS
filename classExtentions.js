define('classExtentions', function () {

    Function.prototype.extend = function (Super) {
        /// <summary>Extend a class</summary>
        /// <param name="Super" type="Function">The Super class to extend</param>
        /// <returns type="Function">The extended class, overwrite your own created class with this!</returns>
        return createClassWrapper(this, Super);
    };

    Function.prototype.wrap = function () {
        /// <summary>Hides the protected values and functions by wrapping it in an Wrapper Class</summary>
        /// <returns type="Function">The wrapper class</returns>
        return createClassWrapper(this);
    };

    function createClassWrapper(OriginalClass, Super) {
        function ClassWrapper() {
            var instance,
                _originalProtected,
                _arguments = arguments;

            function setOriginalProtected(protected) {
                _originalProtected = protected;
            }

            function createExtendedInstance(OriginalClass, Super) {
                /// <summary>Extend OriginalClass with Super class</summary>
                /// <param type="Function">Class to be extended</param>
                /// <param type="Function">Class to extend</param>
                var _superInstance = new Super(),
                    instance,
                    _originalProtected,
                    _superProtected;

                _superInstance = Super.apply(_superInstance, _arguments);
                OriginalClass.prototype = _superInstance;

                instance = new OriginalClass();
                OriginalClass.apply(instance, _arguments);

                _originalProtected = instance.protected;
                _superProtected = Super.protected;

                setOriginalProtected(_originalProtected);

                $.extend(_superProtected, _originalProtected);
                $.extend(_originalProtected, _superProtected);

                return instance;
            }

            (function () {
                /// <summary>Constructor for the ClassWrapper</summary>
                if (Super instanceof Function) {
                    instance = createExtendedInstance(OriginalClass, Super);
                } else {
                    instance = new OriginalClass();
                    OriginalClass.apply(instance, _arguments);
                    setOriginalProtected(instance.protected);
                }

                ClassWrapper.protected = _originalProtected;
                delete instance.protected;
            }());

            return instance;
        }
        return ClassWrapper;
    }

});