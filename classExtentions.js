define('classExtentions', function () {

    Function.prototype.extend = function (Super) {
        return createClassWrapper(this, Super);
    };

    Function.prototype.wrap = function () {
        return createClassWrapper(this);
    };

    function createClassWrapper(OriginalClass, Super) {
        function ClassWrapper() {
            var instance,
                _originalProtected;

            function setOriginalProtected(protected) {
                _originalProtected = protected;
            }

            function createExtendedInstance(OriginalClass, Super) {
                var instance = new OriginalClass(),
                    _superInstance = new Super(),
                    _originalProtected = instance.protected,
                    _superProtected = Super.protected;

                OriginalClass.prototype = _superInstance;

                setOriginalProtected(_originalProtected);

                $.extend(_superProtected, _originalProtected);
                $.extend(_originalProtected, _superProtected);

                return instance;
            }

            /**
             * Constructor
             */
            (function () {
                if (Super instanceof Function) {
                    instance = createExtendedInstance(OriginalClass, Super);
                } else {
                    instance = new OriginalClass();
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