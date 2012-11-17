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
			function hasInitializedBefore() {
				return OriginalClass.initialized;
			}

			function initializeOriginalClass() {
				var instance;
				if (Super instanceof Function) {
					instance = createExtendedInstance.apply(this, arguments);
				} else {
					instance = createInstance.apply(this, arguments);
				}
				stripInstance(instance);
				return instance;
			}

			function stripInstance(instance) {
				delete instance._protected;
				delete instance._constructor;
			}

			function createExtendedInstance() {
				var _super = new Super.OriginalClass();
				var _superProtected = _super._protected;
				delete _super._protected;
				OriginalClass.prototype = _super;
				var instance = new OriginalClass();
				var _protected = instance._protected;
				mergeProtected(_protected, _superProtected);
				applyArguments(instance, arguments);
				return instance;
			}

			function mergeProtected(thisProtected, superProtected) {
				$.extend(superProtected, thisProtected);
				$.extend(thisProtected, superProtected);
			}

			function createInstance() {
				var instance = new OriginalClass();
				applyArguments(instance, arguments);
				return instance;
			}

			function applyArguments(instance, args) {
				if (instance)
					instance._constructor.apply(instance, args);
			}

			return initializeOriginalClass.apply(this, arguments);
		}
		ClassWrapper.OriginalClass = OriginalClass;
		return ClassWrapper;
	}

});