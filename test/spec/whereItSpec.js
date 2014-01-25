/*
 * Copyright (c) 2014. 
 *
 * @Author Andy Tang
 */
(function whereItSpec() {
    'use strict';

    describe('whereIt', function whereItSpec() {

        function simpleAddFunction(x, y, z) {
            return x + y + z;
        }

        whereIt('it should add x with y and z', function addXYZ(x, y, z, result) {
            expect(simpleAddFunction(x, y, z)).toEqual(result);
        }, [
            {
                x: 1,
                y: 2,
                z: 3,
                result: 6
            },
            {
                y: 22,
                x: 11,
                result: 66,
                z: 33
            }
        ]);
    });
}());