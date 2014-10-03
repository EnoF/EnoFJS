// EnoFJS 
// Version: 3.1.0
//
// Copyright (c) 2014. 
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
(function RequireJSSpecScope(define) {
    'use strict';

    describe('RequireJS insurance specs', function requireJSSpecs() {
        it('should make sure the original require can be used', function originalRequire() {
            define('Dependant', function Dependant() {
                return 'Hello';
            });

            var loading = true;
            waitsFor(function waitingForLoad() {
                return !loading;
            });

            require(['Dependant'], function loadModule(dependant){
                loading = false;
                expect(dependant).toEqual('Hello');
            });

            runs(function checkForModule() {
                expect(require('Dependant')).toEqual('Hello');
            });
        });
    });
}(window.define));