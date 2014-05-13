EnoFJS
======
[![Build Status](https://drone.io/github.com/EnoF/EnoFJS/status.png)](https://drone.io/github.com/EnoF/EnoFJS/latest)
[![Code Climate](https://codeclimate.com/github/EnoF/EnoFJS.png)](https://codeclimate.com/github/EnoF/EnoFJS)
[![Coverage Status](https://coveralls.io/repos/EnoF/EnoFJS/badge.png?branch=master)](https://coveralls.io/r/EnoF/EnoFJS?branch=master)
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

Serializable
------------
When sending information over the line in `json` format, the `Serializable` clazz can help. This Class will help you
in serializing your classes into a `json` format.

The class also helps you deserialize a serialized object in `json` format.

    var SerializableObject = clazz(function SerializableObject(){
        this.extend = 'Serializable';

        this.constructor = function constructor(serialized){
            this.super(serialized);
        };
    });

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

ArrayConverters
---------------
In modern browsers `TypedArrays` are introduced. The literal array `[]` or `new Array()`
do not support the `ArrayBuffer` out of the box. To convert an literal array into an
`Uint32Array` this extention on the `Array.prototype` is brought to live.

Usage:

    var array = [1,2,3,4];
    var uInt32Array = array.toUint32Array();
    console.log(uInt32Array[0]); // 67305985
    uInt32Array[0] = uInt32Array[0] + 1;
    array.readUint32ArrayIn(uInt32Array);
    console.log(array); // [2, 2, 3, 4]
