describe('Class module', function(){
    
    it('should be able to create a class', function(){
        Class('Test', function(){});
        
        var test = new Test();
        expect(test instanceof Test).toEqual(true);
    });
    
    it('should be able to create a class with a public method', function(){
        Class('Test', function(){
            this.publicMethod('boolean', 'getFoo', function(){
                return true;
            });
        });
        
        var test = new Test();
        expect(test.getFoo()).toEqual(true);
    });
    
    it('should throw an Type Reference Error when matching wrong types with wrong default values', function(){
        Class('Test', function(){
            this.privateProperty('blaat', 'foo', true);
            
            this.publicMethod('blaat', 'getFoo', function(){
                return this.foo;
            });
        });
        expect(function(){
            var test = new Test();
        }).toThrow('Type Reference Error');
    });
    
    it('should be able to create a private variable accessable through a public function', function(){
        Class('Test', function(){
            this.privateProperty('boolean', 'foo', true);
            
            this.publicMethod('boolean', 'getFoo', function(){
                return this.foo;
            });
        });
        
        var test = new Test();
        expect(test.getFoo()).toEqual(true);
    });
    
    it('should be able to access private functions through a public function', function(){
        Class('Test', function(){
            this.privateProperty('boolean', 'foo', false);
            
            this.privateMethod('boolean', 'convertFoo', function(){
                return !this.foo;
            });
            
            this.publicMethod('boolean', 'getFoo', function(){
                return this.convertFoo();
            });
        });
        
        var test = new Test();
        expect(test.getFoo()).toEqual(true);
    });
    
    it('should be able to access a public variable through a private function', function(){
    	Class('Test', function(){
    		this.publicProperty('string', 'foo', 'bar');
    		
    		this.privateMethod('string', 'getFoo', function(){
    			return this.foo;
    		});
    		
    		this.publicMethod('string', 'sayHello', function(){
    			return "Hi " + this.getFoo();
    		});
    	});
    	
    	var test = new Test();
    	expect(test.sayHello()).toEqual("Hi bar");
    });
    
    it('should throw an type reference error when returning a value of different type', function(){
    	Class('Test', function(){
            this.privateProperty('string', 'foo', 'bar');
            
            this.publicMethod('blaat', 'getFoo', function(){
                return this.foo;
            });
        });
        var test = new Test();
        expect(function(){
            test.getFoo();
        }).toThrow('Type Reference Error');
    });
});
