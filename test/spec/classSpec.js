describe('Class module', function(){
    
    afterEach(function(){
    	Test = undefined;
    });
    
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
    
    it('should be able to pass parameters to constructors', function(){
    	Class('Test', function(bar){
    		this.publicProperty('string', 'foo', bar);
    		
    		this.privateMethod('string', 'getFoo', function(){
    			return this.foo;
    		});
    		
    		this.publicMethod('string', 'sayHello', function(){
    			return "Hi " + this.getFoo();
    		});
    	});
    	
    	try{
    		var test = new Test('bar');
    	}catch(e){
    		console.error(e);
    	}
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
    
    it('should be able to create Constants', function(){
    	Class('Test', function(){
    		this.privateProperty('string', 'foo', 'bar');
            
            this.publicMethod('string', 'getFoo', function(){
                return this.foo;
            });
        }, function(){
        	this.constants('string', 'FOO', 'BAR');
        });
        var test = new Test();
        expect(Test.FOO).toEqual('BAR');
        
        expect(test.getFoo()).toEqual('bar');
    });
    
    describe('Package module', function(){
    	afterEach(function(){
    		com.provictores.Test = undefined;
    		com.provictores.Foo = undefined;
    		com.provictores.Bar = undefined;
    	});
    	
    	it('should be able to create a class inside a package', function(){
	    	Class('com.provictores.Test', function(){
	    		this.privateProperty('string', 'foo', 'bar');
	            
	            this.publicMethod('string', 'getFoo', function(){
	                return this.foo;
	            });
	        }, function(){
	        	this.constants('string', 'FOO', 'BAR');
	        });
	        
	        expect(new com.provictores.Test() instanceof com.provictores.Test).toEqual(true);
	    });
	    
	    it('should be able to access a class from another package', function(){
	    	Class('com.provictores.Test', function(){
	    		this.privateProperty('string', 'foo', 'bar');
	            
	            this.publicMethod('string', 'getFoo', function(){
	                return this.foo;
	            });
	        }, function(){
	        	this.constants('string', 'FOO', 'BAR');
	        });
	        
	        Class('com.provictores.Foo', function(){
	    		this.import('com.provictores.Test');
	            
	            this.publicProperty(this.Test, 'test', new this.Test());
	        });
	        
	        expect(new com.provictores.Foo().test instanceof com.provictores.Test).toEqual(true);
	    });
    });
    
    describe('Extent class', function(){
    	
    	beforeEach(function(){
    		Class('com.provictores.Foo', function(){
	    		this.privateProperty('string', 'foo', 'bar');
	    		
	    		this.protectedProperty('string', 'win', 'tigerblood');
	    		
	    		this.protectedMethod('string', 'lose', function(){
	    			return "You have no " + this.win;
	    		});
	            
	            this.publicMethod('string', 'getFoo', function(){
	                return this.foo;
	            });
	        });
	        
	        Class('com.provictores.Bar', function(){
	        	this.import('com.provictores.Foo');
	        	this.extends(this.Foo);
	        	
	        	this.publicMethod('string', 'getPoo', function(){
	        		return this.foo;
	        	});
	        	
	        	this.publicMethod('string', 'getWin', function(){
	        		return this.win;
	        	});
	        	
	        	this.publicMethod('string', 'youLose', function(){
	        		return this.lose();
	        	});
	        });
    	});
    	
    	afterEach(function(){
			com.provictores.Test = undefined;
			com.provictores.Foo = undefined;
			com.provictores.Bar = undefined;
		});
    	
    	it('should be able to extend a class', function(){
	        var bar = new com.provictores.Bar();
	        expect(bar.getFoo()).toEqual('bar');
	    });
	    
	    it('should throw an error when a child tries to access a private variable', function(){
	    	var bar = new com.provictores.Bar();
	    	expect(function(){
	            bar.getPoo();
	        }).toThrow('Type Reference Error');
	    });
	    
	    it('should be able to access the protected variables and functions', function(){
	    	var bar = new com.provictores.Bar();
	    	expect(bar.getWin()).toEqual('tigerblood');
	    	expect(bar.youLose()).toEqual('You have no tigerblood');
	    });
    });
});
