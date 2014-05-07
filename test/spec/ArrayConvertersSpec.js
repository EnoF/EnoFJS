// EnoFJS 
// Version: 1.2.1
//
// Copyright (c) 2014. 
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
(function ArrayConvertersSpecScope() {
    'use strict';

    describe('Converting', function ArrayConvertersSpec() {

        describe('Normal arrays initialized as []', function NormalArrays() {
            var array;
            var convertedArray;

            beforeEach(function prepareArray() {
                array = [];

                array[0] = 0;
                array[1] = 0;
                array[2] = 0;
                array[3] = 255;

                array[4] = 0;
                array[5] = 0;
                array[6] = 59;
                array[7] = 0;

                array[8] = 0;
                array[9] = 35;
                array[10] = 0;
                array[11] = 0;

                array[12] = 69;
                array[13] = 0;
                array[14] = 0;
                array[15] = 0;

                array[16] = 69;
                array[17] = 35;
                array[18] = 59;
                array[19] = 255;

                convertedArray = array.toUint32Array();
            });

            it('should place the fourth value at the first value', function convert() {
                expect(convertedArray[0]).toEqual(4278190080);
            });

            it('should place the third value at the second value', function convert() {
                expect(convertedArray[1]).toEqual(3866624);
            });

            it('should place the second value at the third value', function convert() {
                expect(convertedArray[2]).toEqual(8960);
            });

            it('should place the first value at the fourth value', function convert() {
                expect(convertedArray[3]).toEqual(69);
            });

            it('should convert a complete byte accordingly', function complete() {
                expect(convertedArray[4]).toEqual(4282065733);
            });
        });

        describe('Read from Uint32Array', function Uint32ArraysToArray() {
            var array;
            var uIntArray;

            beforeEach(function prepareUint32Array() {
                array = [];
                uIntArray = new Uint32Array(5);
                uIntArray[0] = 4278190080;
                uIntArray[1] = 3866624;
                uIntArray[2] = 8960;
                uIntArray[3] = 69;
                uIntArray[4] = 4282065733;
                array.readUint32ArrayIn(uIntArray);
            });

            it('should retrieve the alpha back', function alpha() {
                expect(array[3]).toEqual(255);
            });

            it('should retrieve the blue value back', function blue() {
                expect(array[6]).toEqual(59);
            });

            it('should retrieve the green value back', function green() {
                expect(array[9]).toEqual(35);
            });

            it('should retrieve the red value back', function red() {
                expect(array[12]).toEqual(69);
            });

            it('should retrieve all values back', function all() {
                expect(array[16]).toEqual(69);
                expect(array[17]).toEqual(35);
                expect(array[18]).toEqual(59);
                expect(array[19]).toEqual(255);
            });
        });
    });

}());