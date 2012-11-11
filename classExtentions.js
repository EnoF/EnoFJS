Function.prototype.extend = function (Super) {

    var OriginalClass = this;

    function ClassWrapper() {
        var instance = new OriginalClass(),
            superInstance = new Super(),
            originalProtected = instance.protected,
            superProtected = superInstance.protected;

        $.extend(superProtected, originalProtected);
        $.extend(originalProtected, superProtected);

        return instance;
    }

    return ClassWrapper;
};