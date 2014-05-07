// EnoFJS
// Version: 1.2.1
//
// Copyright (c) 2014.
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
(function LinkedHashMapScope(window, clazz, undefined) {
    'use strict';

    // A `Node` containing a `key` `value` pair.
    // The `key` supports the types integer and string.
    // The `value` however can be of any type.
    // The `Node` will also have, when applicable, a reference to it's neighbors in the list.
    var Node = clazz(function Node() {
        this.private = {
            key: {
                getSet: null
            },
            value: {
                getSet: null
            },
            previous: {
                getSet: null
            },
            next: {
                getSet: null
            }
        };

        this.constructor = function constructor(key, value) {
            this.private.key = key;
            this.private.value = value;
        };
    });

    // LinkedHashMap contains an HashMap.
    // The key is identical to the key of the Node it will store.
    // The value is the Node.

    //      var list = new LinkedHashMap();
    window.LinkedHashMap = clazz(function LinkedHashMap() {
        this.private = {
            duplicateKeyError: 'key already exists in LinkedHashMap',
            keyNotFoundError: 'key not found',
            size: {
                get: 0
            },
            first: {
                get: null
            },
            last: {
                get: null
            },
            hashMap: {},

            // Add a new entry to the HashMap.
            add: function add(key, value) {
                // Throw an error when the key already exists inside of the HashMap.
                if (this.private.hashMap.hasOwnProperty(key)) {
                    throw new Error(this.private.duplicateKeyError);
                }
                var newNode = new Node(key, value);
                this.private.hashMap[key] = newNode;
                this.private.size++;
                return newNode;
            },

            // Remove an entry from the hashMap and removes all
            // references to the node to be removed.
            remove: function remove(node) {
                var key = node.getKey();

                // If the node is also the first entry of the LinkedHashMap,
                // then we should promote the next node as the new first entry!
                if (node === this.private.first) {
                    this.private.first = this.private.first.getNext();
                    if (this.private.first instanceof Node) {
                        // Also make sure to remove the reference to the node
                        // that is going to be deleted.
                        // We don't want any ghosts around here!
                        this.private.first.setPrevious(null);
                    }
                }
                // If the node is the last entry of the LinkedHashMap,
                // then we should promote the previous node as the new last entry!
                else if (node === this.private.last) {
                    // Since we already checked that this node is not the first node, we can
                    // safely assume that there is an previous node.
                    this.private.last = this.private.last.getPrevious();
                    this.private.last.setNext(null);
                }
                // When the node is in the middle, we have to remove the references
                // from the neighbors and let them point to each other instead.
                else {
                    node.getPrevious().setNext(node.getNext());
                    node.getNext().setPrevious(node.getPrevious());
                }
                // Now lets remove :)
                this.private.size--;
                delete this.private.hashMap[key];
            }
        };

        this.protected = {

            // Add a new node after the given node
            addAfter: function addAfter(node, newNode) {
                var nextNode = node.getNext();
                // If the given node isn't the `last` node, make sure to update the references.
                if (nextNode !== null) {
                    nextNode.setPrevious(newNode);
                    newNode.setNext(nextNode);
                }
                // Otherwise we have to update the `last` reference.
                else {
                    this.private.last = newNode;
                }
                // Point the two nodes to each other, as they have become neighbors :)
                node.setNext(newNode);
                newNode.setPrevious(node);
            },

            // Adds a new node before the given node.
            addBefore: function addBefore(node, newNode) {
                var previousNode = node.getPrevious();
                // If the `node` reference isn't the first node,
                // make sure to exchange contacts.
                if (previousNode !== null) {
                    previousNode.setNext(newNode);
                    newNode.setPrevious(previousNode);
                }
                // Otherwise we have to let the `LinkedHashMap` know who is first!
                else {
                    this.private.first = newNode;
                }
                // The new node should say hello to the node he is living in front of now.
                node.setPrevious(newNode);
                newNode.setNext(node);
            }
        };

        this.public = {

            // Add a new key value pair to the LinkedHashMap.
            add: function add(key, value) {
                var newNode = this.private.add(key, value);
                if (this.private.size === 1) {
                    this.private.first = newNode;
                } else {
                    this.protected.addAfter(this.private.last, newNode);
                }
                this.private.last = newNode;

                return newNode;
            },

            // Adds a new node after a given node key.
            // First we look up the `key`, then we introduce the new `node` after
            // the looked up `node`.
            addAfter: function addAfter(nodeKeyToInsertAfter, newKey, newValue) {
                var newNode = this.private.add(newKey, newValue);
                var nodeToInsertAfter = this.public.getById(nodeKeyToInsertAfter);
                this.protected.addAfter(nodeToInsertAfter, newNode);
                return newNode;
            },

            // Adds a new node before a given node key.
            // Again we look up the `node` bound to the given `key` and then we introduce
            // the new `node` before this `node`.
            addBefore: function addBefore(nodeKeyToInsertBefore, newKey, newValue) {
                var newNode = this.private.add(newKey, newValue);
                var nodeToInsertBefore = this.public.getById(nodeKeyToInsertBefore);
                this.protected.addBefore(nodeToInsertBefore, newNode);
                return newNode;
            },

            // Adds a new node at the first position.
            // We have a new first comer!
            addFirst: function addFirst(newKey, newValue) {
                var newNode = this.private.add(newKey, newValue);
                var first = this.private.first;
                // If there was an other node on the first place,
                // let him know who is now number one!
                if (first !== null) {
                    this.protected.addBefore(first, newNode);
                }
                return newNode;
            },

            // Adds a new node at the last position.
            // Similar to the add function, just to prevent the `addFirst` function
            // from feeling lonely.
            addLast: function addLast(newKey, newValue) {
                return this.public.add(newKey, newValue);
            },

            // Find a node reference by his key.
            getById: function getById(key) {
                var node = this.private.hashMap[key];
                if (node === undefined) {
                    throw new Error(this.private.keyNotFoundError);
                }
                return node;
            },
            isEmpty: function isEmpty() {
                return this.private.size === 0;
            },
            // Find the node by it's key and kick it out of the list!
            remove: function remove(key) {
                if (!this.private.hashMap.hasOwnProperty(key)) {
                    return false;
                }
                return this.private.remove(this.public.getById(key));
            },
            removeFirst: function removeFirst() {
                if (this.private.first === null) {
                    return false;
                }
                return this.private.remove(this.private.first);
            },
            removeLast: function removeLast() {
                if (this.private.last === null) {
                    return false;
                }
                return this.private.remove(this.private.last);
            }
        };

        this.constructor = function constructor() {
            this.private.hashMap = {};
        };
    });
}(window, window.clazz));