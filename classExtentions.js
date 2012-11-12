describe('classExtentions', function () {

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
                    superInstance = new Super(),
                    originalProtected = instance.protected,
                    superProtected = Super.protected;

                OriginalClass.prototype = superInstance;

                setOriginalProtected(originalProtected);

                $.extend(superProtected, originalProtected);
                $.extend(originalProtected, superProtected);

                return instance;
            }

            if (Super instanceof Function) {
                instance = createExtendedInstance(OriginalClass, Super);
            } else {
                instance = new OriginalClass();
                setOriginalProtected(instance.protected);
            }

            ClassWrapper.protected = _originalProtected;
            delete instance.protected;

            return instance;
        }
        return ClassWrapper;
    }

});