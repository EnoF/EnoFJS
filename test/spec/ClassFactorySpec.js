/*
 * Copyright (c) 2014. 
 *
 * @Author Andy Tang
 */
(function (undefined) {
    'use strict';

    describe('Class factory', function classFactorySpecs() {

        describe('Class constructor', function classConstructorSpecs() {
            var ClassConstructorTestClass = clazz(function ClassConstructorTestClass() {
                this.private = {
                    foo: 'foo',
                    getBar: function getBar() {
                        return 'bar';
                    },
                    discard: function discard() {
                        this.protected.safe = 'unsafe';
                    }
                };

                this.protected = {
                    safe: 'protection',
                    save: function save() {
                        this.private.foo = 'water';
                    },
                    accessPublic: function accessPublic() {
                        return this.public.property + '!';
                    }
                };

                this.public = {
                    property: 10,
                    getFoo: function getFoo() {
                        return this.private.foo;
                    },
                    setFoo: function setFoo(newFoo) {
                        this.private.foo = newFoo;
                    },
                    getBar: function getBar() {
                        return this.private.getBar() + '!';
                    },
                    getHowdy: function getHowdy() {
                        return this.private.howdy;
                    },
                    getSafe: function getSafe() {
                        return this.protected.safe;
                    },
                    save: function save() {
                        this.protected.save();
                    },
                    discard: function discard() {
                        this.private.discard();
                    },
                    getBars: function getBars() {
                        return this.public.getBar() + ' ' + this.public.getBar();
                    },
                    getProperty: function getProperty() {
                        return this.protected.accessPublic();
                    }
                };

                this.constructor = function (howdy) {
                    this.private.howdy = howdy;
                };
            });
            var classConstructorTestClass;

            beforeEach(function beforeEach() {
                classConstructorTestClass = new ClassConstructorTestClass();
            });

            it('should be be able to create a class with private members', function privateMember() {
                expect(classConstructorTestClass.foo).toEqual(undefined);
                expect(classConstructorTestClass.bar).toEqual(undefined);
            });

            it('should be able to access private members through public members', function privateThroughPublic() {
                expect(classConstructorTestClass.getBar()).toEqual('bar!');
            });

            it('should be able to modify private members through public members', function modifyThroughPublic() {
                classConstructorTestClass.setFoo('whatsup');
                expect(classConstructorTestClass.getFoo()).toEqual('whatsup');
            });

            it('should be able to access private variable through constructor', function modifyThroughConstructor() {
                classConstructorTestClass = new ClassConstructorTestClass('HowdyHo!');
                expect(classConstructorTestClass.getHowdy()).toEqual('HowdyHo!');
            });

            it('should be able to access protected variable through public members', function protectThroughPublic() {
                expect(classConstructorTestClass.getSafe()).toEqual('protection');
            });

            it('should be able to access private through protected members', function privateThroughProtected() {
                classConstructorTestClass.save();
                expect(classConstructorTestClass.getFoo()).toEqual('water');
            });

            it('should be able to access a protected through private members', function protectedThroughPrivate() {
                classConstructorTestClass.discard();
                expect(classConstructorTestClass.getSafe()).toEqual('unsafe');
            });

            it('should be able to refer to a public from public members', function publicToPublic() {
                expect(classConstructorTestClass.getBars()).toEqual('bar! bar!');
            });

            it('should be possible to access public through protected', function publicToProtected() {
                expect(classConstructorTestClass.getProperty()).toEqual('10!');
            });
        });

        describe('Class extending', function classExtendingSpecs() {
            var Animal = clazz(function Animal() {
                this.private = {
                    age: 0,
                    say: null
                };

                this.protected = {
                    name: 'Davidson'
                };

                this.public = {
                    getName: function getName() {
                        return this.protected.name;
                    },
                    setName: function setName(name) {
                        this.protected.name = name;
                    },
                    getAge: function getAge() {
                        return this.private.age;
                    },
                    setAge: function setAge(age) {
                        this.private.age = age;
                    },
                    sayHi: function sayHi() {
                        return this.private.say;
                    }
                };

                this.constructor = function (say) {
                    this.private.say = say;
                };
            });

            var Dog = clazz(function Dog() {
                this.extend = 'Animal';

                this.private = {
                    favoriteFood: 'snacks',
                    getWrappedName: function getWrappedName() {
                        return '(' + this.public.getName() + ')';
                    }
                };

                this.protected = {
                    nickName: null
                };

                this.public = {
                    getFullName: function getFullName() {
                        return this.protected.nickName + this.private.getWrappedName();
                    },
                    getParentAge: function getParentAge() {
                        return this.private.age;
                    },
                    getAge: function getAge() {
                        return this.public.getFullName() + ' is ' + this.super.getAge() +
                            ' years old';
                    }
                };

                this.constructor = function (nickName, say) {
                    this.protected.nickName = nickName;
                    this.super.constructor(say);
                };
            });

            var dog;

            beforeEach(function beforeEach() {
                dog = new Dog('Harley', 'woof');
            });

            it('should be able to get the protected of an extended class', function protectOfExtend() {
                expect(dog.getFullName()).toEqual('Harley(Davidson)')
            });

            it('should prevent access to parent private', function preventParentPrivate() {
                expect(dog.getParentAge()).toEqual(undefined);
            });

            it('should modify protected values through parent public', function modifyProtectThroughParent() {
                dog.setName('Davidson!');
                expect(dog.getFullName()).toEqual('Harley(Davidson!)');
                expect(dog.getName()).toEqual('Davidson!');
            });

            it('should be able to call the super of the parent', function superOfFunction() {
                expect(dog.getAge()).toEqual('Harley(Davidson) is 0 years old');
            });

            it('should be able to get the super constructor', function superConstructor() {
                expect(dog.sayHi()).toEqual('woof');
            });
        });

        describe('Border cases', function borderCasesSpecs() {
            Array.prototype.noop = function () {
            };
            var ClassConstructorTestClass = clazz(function ClassConstructorTestClass() {
                this.public = ['banana'];

                this.public.foo = 'foo';
                this.public.getBar = function getBar() {
                    return 'bar';
                };

                this.constructor = function () {

                };
            });
            var classConstructorTestClass;

            beforeEach(function beforeEach() {
                classConstructorTestClass = new ClassConstructorTestClass();
            });

            it('should not copy functions inside an array', function () {
                expect(classConstructorTestClass.noop).toEqual(undefined);
                expect(classConstructorTestClass.getBar()).toEqual('bar');
            });

        });
    });
}());
