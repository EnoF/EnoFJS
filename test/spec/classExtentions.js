/// <reference path="../../classExtentions.js" />
describe('class extentions', function () {

    var _moduleLoaded = false,
        Parent,
        Child;
    
    it('should load the classExtentions module before the tests can begin', function () {
        require(['classExtentions'], function () {
            function _Parent(name) {
                var _water = "WATER",
                    _cola,

                    protected = {
                        foo: "FOO",
                        bar: function () {
                            return "BAR";
                        },
                        override: "WAIT",
                        hello: "Hello",
                        sayHello: function () {
                            return protected.hello;
                        }
                    };

                this.getName = function () {
                    return name;
                };

                this.getWater = function () {
                    return "HERE IS SOME " + _water;
                };

                this.getCola = function () {
                    return _cola;
                };

                this.setCola = function (cola) {
                    _cola = cola;
                };

                this.protected = protected;
            }
            Parent = _Parent.wrap();

            function _Child() {
                var protected = {
                    food: "FOOD",
                    getFooBar: function () {
                        return protected.foo + " " + protected.bar();
                    },
                    override: "DONE",
                    hello: "Hi!"
                };

                this.protected = protected;

                this.getProtected = function () {
                    return protected;
                };

                this.tryGetWater = function () {
                    return "HERE IS SOME " + _water;
                };
            }
            Child = _Child.extend(Parent);
            _moduleLoaded = true;
        });

        waitsFor(function () {
            return _moduleLoaded;
        });

        runs(function () {
            expect(_moduleLoaded).toBeTruthy();
        });
    });

    describe('extending a class', function () {

        it('should copy protected variables from parent to child', function () {
            var child = new Child();

            expect(child.getProtected().getFooBar()).toEqual("FOO BAR");
        });

        it('should be able to override variables', function () {
            var child = new Child();

            expect(child.getProtected().override).toEqual("DONE");
        });

        it('should hide this.protected variables after extending', function () {
            var child = new Child();

            expect(child.protected).toEqual(undefined);
        });

        it('should be able to get the public functions', function(){
            var child = new Child();

            expect(child.getWater()).toEqual("HERE IS SOME WATER");
        });

        it('should not share the same public functions', function () {
            var child = new Child(),
                otherChild = new Child();

            child.setCola("Coca cola");
            otherChild.setCola("Pepsi");

            expect(child.getCola()).toEqual("Coca cola");
            expect(otherChild.getCola()).toEqual("Pepsi");
        });

        it('should not be able to call private variables directly from a child', function () {
            var child = new Child();

            expect(function () {
                child.tryGetWater();
            }).toThrow("_water is not defined");
        });

        it('should use the overwritten protected variables for protected functions', function () {
            var child = new Child();

            expect(child.getProtected().sayHello()).toEqual("Hi!");
        });

        it('should be possible to add parameters to the constructor', function () {
            var child = new Child("Andy");

            expect(child.getName()).toEqual("Andy");
        });

        it('should be the instance of Parent', function () {
            var child = new Child(),
                parent = new Parent();
        
            expect(child instanceof parent.constructor).toBeTruthy();
        });
    });

    describe('wrapping classes ready to get extended', function () {
        it('should hide this.protected variables after wrapping', function () {
            var parent = new Parent();

            expect(parent.protected).toEqual(undefined);
        });
    });

});