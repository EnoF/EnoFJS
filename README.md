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
    var test = new Test();
    
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

Package a class

    Class('com.provictores.Test', function(){});
    var test = new com.provictores.Test();
    
Import a class

    Class('com.provictores.Foo', function(){
        this.publicProperty('string', 'food', 'banana');
    });
    
    Class('com.provictores.Bar', function(){
        this.import('com.provictores.Foo'); //access with this.Foo
        
        this.publicMethod('string', 'getFood', function(){
            return this.Foo.food; //banana
        });
    });

Extending a class

    Class('com.provictores.Foo', function(){
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
    
    Class('com.provictores.Bar', function(){
        this.extends('com.provictores.Foo'); 
        
        // @overides the method in foo
        this.publicMethod('string', 'getFood', function(){
            //this.foo will return "undefined" as food is a private property
            //this.food will return "banana" as food is a public property
            //this.upFool will execute the method upFool as this is a protected method
            return "I " + this.foo + " " + this.food + " and I said this " + this.upFool() + " times";
        });
    });
