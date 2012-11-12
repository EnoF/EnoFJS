describe('classExtentions', function () {

    Function.prototype.extend = function (Super) {

        return createClassWrapper(this, Super);
    };

    function createClassWrapper(OriginalClass, Super) {
        function ClassWrapper() {
            var instance = createInstance(OriginalClass, Super);

            delete instance.protected;

            return instance;
        }
        return ClassWrapper;
    }

    function createInstance(OriginalClass, Super) {
        var instance = new OriginalClass(),
            superInstance = new Super(),
            originalProtected = instance.protected,
            superProtected = superInstance.protected;

        $.extend(superProtected, originalProtected);
        $.extend(originalProtected, superProtected);

        return instance;
    }
});