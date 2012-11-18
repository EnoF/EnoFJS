define(['classExtentions'], function () {
  describe('class extentions', function () {

    function Parent(name) {
      var _water = 'WATER',
          _cola,
          _name,

          _protected = {
            foo: 'FOO',
            bar: function () {
              return 'BAR';
            },
            override: 'WAIT',
            hello: 'Hello',
            sayHello: function () {
              return _protected.hello;
            }
          };

      this._constructor = function (name) {
        _name = name;
      };

      this.getName = function () {
        return _name;
      };

      this.getWater = function () {
        return 'HERE IS SOME ' + _water;
      };

      this.getCola = function () {
        return _cola;
      };

      this.setCola = function (cola) {
        _cola = cola;
      };

      this._protected = _protected;
    }
    Parent = Parent.wrap();

    function _Child() {
      var _protected = {
        food: 'FOOD',
        getFooBar: function () {
          return _protected.foo + ' ' + _protected.bar();
        },
        override: 'DONE',
        hello: 'Hi!'
      };

      this._protected = _protected;

      this.getProtected = function () {
        return _protected;
      };

      this.tryGetWater = function () {
        return 'HERE IS SOME ' + _water;
      };
    }
    Child = _Child.extend(Parent);

    describe('extending a class', function () {

      it('should copy _protected variables from parent to child', function () {
        console.debug(Child);
        var child = new Child();

        expect(child.getProtected().getFooBar()).toEqual('FOO BAR');
      });

      it('should be able to override variables', function () {
        var child = new Child();

        expect(child.getProtected().override).toEqual('DONE');
      });

      it('should hide this._protected variables after extending', function () {
        var child = new Child();

        expect(child._protected).toEqual(undefined);
      });

      it('should be able to get the public functions', function () {
        var child = new Child();

        expect(child.getWater()).toEqual('HERE IS SOME WATER');
      });

      it('should not share the same public functions', function () {
        var child = new Child(),
            otherChild = new Child();

        child.setCola('Coca cola');
        otherChild.setCola('Pepsi');

        expect(child.getCola()).toEqual('Coca cola');
        expect(otherChild.getCola()).toEqual('Pepsi');
      });

      it('should not be able to call private variables directly from a child', function () {
        var child = new Child();

        expect(function () {
          child.tryGetWater();
        }).toThrow('_water is not defined');
      });

      it('should use the overwritten _protected variables for _protected functions', function () {
        var child = new Child();

        expect(child.getProtected().sayHello()).toEqual('Hi!');
      });

      it('should be possible to add parameters to the constructor', function () {
        var child = new Child('Andy');

        expect(child.getName()).toEqual('Andy');
      });

      it('should be the instance of Parent', function () {
        var child = new Child(),
            parent = new Parent();

        expect(child instanceof parent.constructor).toBeTruthy();
      });
    });

    function BrokenClass() {

    }
    BrokenClass = BrokenClass.wrap();

    describe('wrapping classes ready to get extended', function () {

    	it('should be able to instantiate a wrapped class', function () {
    		var parent = new Parent('Andy');

    		expect(parent.getName()).toEqual('Andy');
    	});

    	it('should not instantiate anything when calling the function as a function', function () {
    		expect(function () {
    			Parent('Andy');
    		}).toThrow('Instantiate a class with a new statement');
    	});

    	it('should not instantiate a class without a constructor', function () {
    		expect(function () {
    			new BrokenClass();
    		}).toThrow('Class has no constructor defined');
    	});

    	it('should hide this._protected variables after wrapping', function () {
        var parent = new Parent();

        expect(parent._protected).toEqual(undefined);
      });
    });

  });

});