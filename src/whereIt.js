/*
 * Copyright (c) 2014. 
 *
 * @Author Andy Tang
 */
(function whereIt(it, LinkedHashMap) {
    'use strict';

    function executeTest(description, test, matchedArguments) {
        var args = extractArguments(matchedArguments);
        it(createTestDescription(description, args), function executeTest() {
            test.apply(this, args);
        });
    }

    function createTestDescription(description, args) {
        return description + ' [' + args + ']';
    }

    /**
     * Matches the given with the arguments, this way, you
     * can rearrange the arguments as you wish
     *
     * @param test
     * @param testArguments
     * @returns {window.LinkedHashMap}
     */
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

    /**
     * Adds the value at the correct place inside the list
     *
     * @param index
     * @param testArgument
     * @param list
     * @returns {Node}
     */
    function placeAtRightPositionInList(index, testArgument, list) {
        for (var node = list.getFirst(); node; node = node.getNext()) {
            if (index < node.getKey()) {
                return list.addBefore(node.getKey(), index, testArgument);
            }
        }
        return list.add(index, testArgument);
    }

    /**
     * Converts the list of arguments to an array
     *
     * @param matchedArguments
     * @returns {Array}
     */
    function extractArguments(matchedArguments) {
        var args = [];
        for (var node = matchedArguments.getFirst(); node; node = node.getNext()) {
            args.push(node.getValue());
        }
        return args;
    }

    /**
     * Allows the test case to addapt multiple scenarios for the unit to be tested with
     *
     * @param description The description of the test
     * @param test The test
     * @param whereCases The given input and results
     */
    window.whereIt = function whereIt(description, test, whereCases) {
        for (var i = 0; i < whereCases.length; i++) {
            executeTest(description, test, matchGiven(test, whereCases[i]));
        }
    };
}(window.it, window.LinkedHashMap));