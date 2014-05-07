// EnoFJS
// Version: 1.2.1
//
// Copyright (c) 2014.
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
(function whereIt(it, LinkedHashMap) {
    'use strict';

    // Create new test cases, ready to be executed by Jasmine

    //      whereIt('should add', function addNumbers(x, y, result){
    //          expect(calulator.add(x, y)).toEqual(result);
    //      }, [
    //          {
    //                x: 1,
    //                y: 2,
    //                result: 3
    //          },
    //          {
    //              y: 200,
    //              x: 2,
    //              result: 202
    //          }
    //      ]);
    window.whereIt = function whereIt(description, test, whereCases) {
        for (var i = 0; i < whereCases.length; i++) {
            // Before registering the tests, we match the Given arguments
            // to the test cases.
            registerTest(description, test, matchGiven(test, whereCases[i]));
        }
    };

    // Register the test with the arguments as if the tests were
    // registered normally through Jasmine.
    function registerTest(description, test, matchedArguments) {
        // First we extract the arguments so we can pass it to the test.
        var args = extractArguments(matchedArguments);
        // Create a customized test description to easily recognize which test fails.
        it(createTestDescription(description, args), function executeTest() {
            test.apply(this, args);
        });
    }

    // Lets make our tests identifiable by the parameters provided to the test case.
    function createTestDescription(description, args) {
        return description + ' [' + args + ']';
    }

    // Matches the given with the arguments, this way, you
    // can rearrange the arguments as you wish.
    function matchGiven(test, testArguments) {
        var testAsString = test.toString();
        var list = new LinkedHashMap();
        var index;
        for (var i in testArguments) {
            if (testArguments.hasOwnProperty(i)) {
                index = testAsString.indexOf(i + ',');
                if (index === -1) {
                    index = testAsString.indexOf(i + ')');
                }
                placeAtRightPositionInList(index, testArguments[i], list);
            }
        }
        return list;
    }

    // Adds the value at the correct place inside the list.
    function placeAtRightPositionInList(index, testArgument, list) {
        for (var node = list.getFirst(); node; node = node.getNext()) {
            if (index < node.getKey()) {
                return list.addBefore(node.getKey(), index, testArgument);
            }
        }
        return list.add(index, testArgument);
    }

    // Converts the list of arguments to an array.
    function extractArguments(matchedArguments) {
        var args = [];
        for (var node = matchedArguments.getFirst(); node; node = node.getNext()) {
            args.push(node.getValue());
        }
        return args;
    }


}(window.it, window.LinkedHashMap));