/*
 * Copyright (c) 2014. 
 *
 * @Author Andy Tang
 */
(function LinkedHashMapSpecScope(undefined) {
    'use strict';

    describe('LinkedHashMap', function LinkedHashMapSpec() {

        describe('initalizing an LinkedHashMap', function initializingLinkedHashMap() {
            it('should be able to add an entry to the list', function addToEmpty() {
                var list = new LinkedHashMap();
                list.add(0, 'hello');
                expect(list.getById(0).getValue()).toEqual('hello');
                expect(list.getById(0).getNext()).toEqual(null);
                expect(list.getById(0).getPrevious()).toEqual(null);
            });

            it('should be able to add the first entry with addFirst', function addFirstAsFirst() {
                var list = new LinkedHashMap();
                list.addFirst(0, 'hello');
                expect(list.getById(0).getValue()).toEqual('hello');
                expect(list.getById(0).getNext()).toEqual(null);
                expect(list.getById(0).getPrevious()).toEqual(null);
            });

            it('should be able to add the first entry with addLast', function addLastAsFirst() {
                var list = new LinkedHashMap();
                list.addLast(0, 'hello');
                expect(list.getById(0).getValue()).toEqual('hello');
                expect(list.getById(0).getNext()).toEqual(null);
                expect(list.getById(0).getPrevious()).toEqual(null);
            });

            it('should return false when trying to remove something that has not been added', function removeGhost() {
                var list = new LinkedHashMap();
                expect(list.remove('ghost')).toEqual(false);
            });

            it('should return false when trying to remove the first or lastwhen empty', function firstEmpty() {
                var list = new LinkedHashMap();
                expect(list.removeFirst()).toEqual(false);
                expect(list.removeLast()).toEqual(false);
            });

            it('should return true when the map is empty, but false when it is not', function emptyMap() {
                var list = new LinkedHashMap();
                expect(list.isEmpty()).toEqual(true);
                list.add(0, 'hello');
                expect(list.isEmpty()).toEqual(false);
            });
        });

        describe('modifying an LinkedHashMap', function modifyLinkedHashMapSpecs() {
            var list;
            beforeEach(function beforeEach() {
                list = new LinkedHashMap();
                list.add(0, 'one');
                list.add(1, 'two');
                list.add(2, 'three');
            });

            it('should be able to get the first entry of an list', function firstOfList() {
                var first = list.getFirst();
                expect(first.getValue()).toEqual('one');
                expect(first.getNext()).toEqual(list.getById(1));
                expect(first.getPrevious()).toEqual(null);
            });

            it('should be able to get the last entry of an list', function lastOfList() {
                var last = list.getLast();
                expect(last.getValue()).toEqual('three');
                expect(last.getNext()).toEqual(null);
                expect(last.getPrevious()).toEqual(list.getById(1));
            });

            it('should be able to add a node after another node', function addAfter() {
                var middle = list.getById(1);
                var newNode = list.addAfter(1, 3, 'four');
                expect(middle.getNext()).toEqual(newNode);
                expect(newNode.getPrevious()).toEqual(middle);
                expect(newNode.getNext()).toEqual(list.getLast());
            });

            it('should be able to add a node before another node', function addBefore() {
                var middle = list.getById(1);
                var newNode = list.addBefore(1, 3, 'four');
                expect(middle.getPrevious()).toEqual(newNode);
                expect(newNode.getNext()).toEqual(middle);
                expect(newNode.getPrevious()).toEqual(list.getFirst());
            });

            it('should be able to add a node at the beginning of the list', function addFirst() {
                var first = list.getFirst();
                var newNode = list.addFirst(3, 'four');
                expect(first.getPrevious()).toEqual(newNode);
                expect(newNode.getNext()).toEqual(first);
                expect(newNode.getPrevious()).toEqual(null);
            });

            it('should be able to add a node at the end of the list', function addLast() {
                var last = list.getLast();
                var newNode = list.addLast(3, 'four');
                expect(last.getNext()).toEqual(newNode);
                expect(newNode.getPrevious()).toEqual(last);
                expect(newNode.getNext()).toEqual(null);
            });

            it('should be able to delete the first entry', function removeFirst() {
                list.removeFirst();
                var first = list.getFirst();
                expect(first.getValue()).toEqual('two');
                expect(first.getPrevious()).toEqual(null);
            });

            it('should be able to delete all entries', function removeFirstWithRemove() {
                list.remove(0);
                list.remove(1);
                list.remove(2);
                expect(list.isEmpty()).toEqual(true);
            });

            it('should be able to remove the last entry', function removeLast() {
                list.removeLast();
                var last = list.getLast();
                expect(last.getValue()).toEqual('two');
                expect(last.getNext()).toEqual(null);
            });

            it('should be able to remove an entry in the middle', function remove() {
                list.remove(1);
                expect(function keyNotFound() {
                    list.getById(1);
                }).toThrow(new Error('key not found'));
                expect(list.getFirst().getNext()).toEqual(list.getLast());
                expect(list.getLast().getPrevious()).toEqual(list.getFirst());
            });

            it('should prevent adding the same key twice', function preventDuplicateKey() {
                expect(function testDuplicateKey() {
                    list.add(1, 'something');
                }).toThrow(new Error('key already exists in LinkedHashMap'));
            });

            it('should throw an error when a key is not found in the hashMap', function keyNotFound() {
                expect(function throwNotFound() {
                    list.getById('nonexisting');
                }).toThrow(new Error('key not found'));
            });

            it('should throw an error when attempted to add after an non existing node', function addAfterNono() {
                expect(function testNono() {
                    list.addAfter('nono', 'what', 'ever');
                }).toThrow(new Error('key not found'));
            });

            it('should be able to add before the first node', function addBeforeFirst() {
                list.addBefore(0, 3, 'four');
                expect(list.getFirst().getValue()).toEqual('four');
            });

            it('should be able to add after the last node', function addAfterLast() {
                list.addAfter(2, 3, 'four');
                expect(list.getLast().getValue()).toEqual('four');
            });

            it('should be able to loop through an list', function loop() {
                for (var node = list.getFirst(); node; node = node.getNext()) {
                }
                expect(node).toEqual(null);
            });

            it('should return the size of the list', function getSize() {
                expect(list.getSize()).toEqual(3);
            });
        });
    });
}());