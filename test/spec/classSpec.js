describe('Class module', function(){
    
    it('should be able to create a class', function(){
        Class('Test', function(){});
        
        var test = new Test();
        expect(test instanceof Test).toEqual(true);
    });
    
    it('should be able to create a class with a public method', function(){
        Class('Test', function(){
            this.publicMethod('getFoo', function(){
                return true;
            });
        });
        
        var test = new Test();
        expect(test.getFoo()).toEqual(true);
    });
    
    it('should throw an Type Reference Error when matching wrong types with wrong default values', function(){
        Class('Test', function(){
            this.privateProperty('blaat', 'foo', true);
            
            this.publicMethod('getFoo', function(){
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
            
            this.publicMethod('getFoo', function(){
                return this.foo;
            });
        });
        
        var test = new Test();
        expect(test.getFoo()).toEqual(true);
    });
    
    it('should be able to access private functions through a public function', function(){
        Class('Test', function(){
            this.privateProperty('boolean', 'foo', false);
            
            this.privateMethod('convertFoo', function(){
                return !this.foo;
            });
            
            this.publicMethod('getFoo', function(){
                return this.convertFoo();
            });
        });
        
        var test = new Test();
        expect(test.getFoo()).toEqual(true);
    });
});
