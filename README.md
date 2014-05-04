EnoFJS [![Build Status](https://travis-ci.org/EnoF/EnoFJS.svg?branch=master)](https://travis-ci.org/EnoF/EnoFJS)
======
Inheritance
-----------
Javascript supports private and public out of the box. However
inheritance is often claimed impossible or done with prototype.

While inheriting with prototype is not necessarily bad, it
however implies that all inheritable properties have to be public
and all properties should be public in case a function in the
prototype needs to access it.

To make this possible, EnoFJS implements a ClassFactory, handling
all the trouble of scoping and inheriting.

    var Dog = clazz(function Dog(name){
        this.extend = 'Animal';

        this.private = {
            name: null
        };

        this.protected = {
            nickName: {
                getSet: null
            }
        };

        this.public = {
            barkName: function barkName(){
                return 'Woof, my name is ' + this.private.name +
                    ', but you can call me ' +
                    this.protected.nickName + '!';
            }
        };

    });
    var dog = new Dog('fluffy duffy');
    dog.setNickName('fluffy');
    expect(dog.barkName()).
        toEqual('Woof, my name is fluffy duffy' +
                ', but you can call me fluffy!');

LinkedHashMap
-------------
A LinkedHashMap has the advantage of a LinkedList, able to quickly
add or remove a Node between already existing nodes. However a LinkedList is slower
in finding an entry in the middle of the list, because it has to search
through the entire list!

With the implementation of a LinkedHashMap, it keeps the ability to insert
or remove nodes like a LinkedList. For searching the implementation of a HashMap
is used. This way you have best of both worlds!

    var list = new LinkedHashMap();
    list.add(0, 'one');
    list.add(1, 'two');
    list.add(2, 'three');
    expect(list.get(1).getValue()).toEqual('two');
    list.addAfter('an non integer key', 'four');
    expect(list.get('an non integer key').getNext().
                        getValue()).toEqual('three');

WhereIt
-------
The `whereIt` is an extention for the Jasmine test framework. Often you have a test cases
where the same process will be executed with different parameters, expecting different
results. The `whereIt` assists in doing this with a simple configuration!

Configuration will be matched to the variable names!

    whereIt('should add', function addNumbers(x, y, result){
        expect(calulator.add(x, y)).toEqual(result);
    }, [
        {
            x: 1,
            y: 2,
            result: 3
        },
        {
            y: 200,
            x: 2,
            result: 202
        }
    ]);