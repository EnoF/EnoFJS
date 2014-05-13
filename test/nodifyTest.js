// EnoFJS 
// Version: 1.3.0
//
// Copyright (c) 2014. 
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
(function nodifyTestScope() {
    'use strict';

    describe('Test if the modules are exposed correctly via modules', function nodifyTest() {

        var enofjs;

        beforeEach(function loadEnoFJS() {
            enofjs = require('../index.js');
        });

        it('should expose clazz', function exposeClazz() {
            enofjs.clazz.should.be.an.Function;
        });

        it('should expose LinkedHashMap', function exposeLinkedHashMap() {
            enofjs.LinkedHashMap.should.be.an.Function;
        });
    });

}());