/*
 * Copyright (c) 2014. 
 *
 * @Author Andy Tang
 */
(function LinkedHashMapScope(window, clazz, undefined) {
    'use strict';

    /**
     * A node containing a key value pair
     * @type {Node}
     */
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

    /**
     * LinkedHashMap contains a map of key and a Node
     * The Node will have a reference to the neighbour nodes,
     * similar to a LinkedList
     *
     * @type {LinkedHashMap}
     */
    window.LinkedHashMap = clazz(function LinkedHashMap() {
        this.private = {
            duplicateKeyError: 'key already exists in LinkedHashMap',
            keyNotFoundError: 'key not found',
            count: 0,
            first: null,
            last: null,
            hashMap: {},

            /**
             * Add a new entry to the hashMap
             *
             * @throws key already exists in LinkedHashMap
             * @param key {Integer|String} the key that will be used to reference the node
             * @param value {*}the value that will be stored in the node
             * @returns {Node}
             */
            add: function add(key, value) {
                if (this.private.hashMap.hasOwnProperty(key)) {
                    throw new Error(this.private.duplicateKeyError);
                }
                var newNode = new Node(key, value);
                this.private.hashMap[key] = newNode;
                this.private.count++;
                return newNode;
            },

            /**
             * Remove an entry from the hashMap and removes all
             * references to the node to be removed
             * @param node {Node} the node that will be removed
             */
            remove: function remove(node) {
                var key = node.getKey();
                if (node === this.private.first) {
                    this.private.first = this.private.first.getNext();
                    if (this.private.first instanceof Node) {
                        this.private.first.setPrevious(null);
                    }
                } else if (node === this.private.last) {
                    this.private.last = this.private.last.getPrevious();
                    this.private.last.setNext(null);
                } else {
                    node.getPrevious().setNext(node.getNext());
                    node.getNext().setPrevious(node.getPrevious());
                }
                this.private.count--;
                delete this.private.hashMap[key];
            }
        };

        this.protected = {

            /**
             * Adds a new node after the given node
             *
             * @param node {Node} a reference node where the new node will be added after
             * @param newNode {Node} the new node to be added
             */
            addAfter: function addAfter(node, newNode) {
                var nextNode = node.getNext();
                if (nextNode !== null) {
                    nextNode.setPrevious(newNode);
                    newNode.setNext(nextNode);
                } else {
                    this.private.last = newNode;
                }
                node.setNext(newNode);
                newNode.setPrevious(node);
            },

            /**
             * Adds a new node before the given node
             *
             * @param node {Node} a reference node where the new node will be added before
             * @param newNode {Node} the new node to be added
             */
            addBefore: function addBefore(node, newNode) {
                var previousNode = node.getPrevious();
                if (previousNode !== null) {
                    previousNode.setNext(newNode);
                    newNode.setPrevious(previousNode);
                } else {
                    this.private.first = newNode;
                }
                node.setPrevious(newNode);
                newNode.setNext(node);
            }
        };

        this.public = {

            /**
             * Add a new key value pair to the LinkedHashMap
             * The newly added node will update the last node to point to
             * this new node.
             *
             * @throws key already exists in LinkedHashMap
             * @param key {Integer|String} the key which will serve as a reference point
             * @param value {*} the value to be stored
             * @returns {Node}
             */
            add: function add(key, value) {
                var newNode = this.private.add(key, value);
                if (this.private.count === 1) {
                    this.private.first = newNode;
                } else {
                    this.protected.addAfter(this.private.last, newNode);
                }
                this.private.last = newNode;

                return newNode;
            },

            /**
             * Adds a new node after a given node key
             *
             * @param nodeKeyToInsertAfter {Integer|String} the key of the node
             *        the new node has to be added after
             * @param newKey {Integer|String} the key of the new node
             * @param newValue {*} the value of the new node
             * @throws key not found
             * @returns {Node}
             */
            addAfter: function addAfter(nodeKeyToInsertAfter, newKey, newValue) {
                var newNode = this.private.add(newKey, newValue);
                var nodeToInsertAfter = this.public.getById(nodeKeyToInsertAfter);
                this.protected.addAfter(nodeToInsertAfter, newNode);
                return newNode;
            },

            /**
             * Adds a new node before a given node key
             *
             * @param nodeKeyToInsertBefore {Integer|String} the key of the node
             *        the new node has to be added before
             * @param newKey {Integer|String} the key of the new node
             * @param newValue {*)
             * @throws key not found
             * @returns {Node}
             */
            addBefore: function addBefore(nodeKeyToInsertBefore, newKey, newValue) {
                var newNode = this.private.add(newKey, newValue);
                var nodeToInsertBefore = this.public.getById(nodeKeyToInsertBefore);
                this.protected.addBefore(nodeToInsertBefore, newNode);
                return newNode;
            },

            /**
             * Adds a new node at the first position
             *
             * @param newKey {Integer|String} the key for the new node
             * @param newValue {*} the value of the new node
             * @returns {Node}
             */
            addFirst: function addFirst(newKey, newValue) {
                var newNode = this.private.add(newKey, newValue);
                var first = this.private.first;
                if (first !== null) {
                    this.protected.addBefore(first, newNode);
                }
                return newNode;
            },

            /**
             * Adds a new node at the last position
             *
             * @param newKey {Integer|String} the key for the new node
             * @param newValue {*} the value of the new node
             * @returns {Node}
             */
            addLast: function addLast(newKey, newValue) {
                return this.public.add(newKey, newValue);
            },

            /**
             * Gets a node by id (key)
             *
             * @throws key not found
             * @param key {Integer|String} the key of the node
             * @returns {Node}
             */
            getById: function getById(key) {
                var node = this.private.hashMap[key];
                if (node === undefined) {
                    throw new Error(this.private.keyNotFoundError);
                }
                return node;
            },
            getFirst: function getFirst() {
                return this.private.first;
            },
            getLast: function getLast() {
                return this.private.last;
            },
            getSize: function getSize() {
                return this.private.count;
            },
            isEmpty: function isEmpty() {
                return this.private.count === 0;
            },
            /**
             * Removes a node with a given key
             *
             * @param key {Integer|String} key of the node to be removed
             * @returns {}
             */
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

        };
    });
}(window, window.clazz));