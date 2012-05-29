EnoFJS
======
OO based programming in Javascript, is often hard to understand. 
Most people with a C# or Java background often lose track of the 
scope of variables. 

Goal
----
In EnoFJS the C# or Java like class is simulated in Javascript.
The goal of this project is to help people understand Javascript 
and it's way of scoping variables. 

Overview
--------
EnoFJS is a layer that translates the your class declaration into
a class with your declared scoping on methods and properties. To 
make this work you will need to understand OO-programming and 
a glance of an example. The example should be sufficient for 
an advanced OO-programmer.

Support
-------
At this moment EnoFJS supports:
 * Namespacing
 * Class Declarations
 * public properties
 * public methods
 * protected properties
 * protected methods
 * private properties
 * private methods
 * Class Constants
 * Class Extentions
 * Class Imports

Exameples
--------
Declaring a class

    Class('Test', function(){});
    
Declaring properties

    Class('Test', function(){
        this.privateProperty('boolean', 'foo', false);
        this.publicProperty('string', 'food', 'banana');
        this.protectedProperty('integer', 'fool', 0);
        this.privateMethod('boolean', 'getFoo', function(){
            return this.foo;
        });
        this.publicMethod('string', 'getFood', function(){
            return this.food;
        });
        this.protectedMethod('boolean', 'upFool', function(){
            this.fool++;
        });
    });
