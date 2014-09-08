// EnoFJS
// Version: 3.0.0
//
// Copyright (c) 2014.
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        coveralls: {
            options: {
                'coverage_dir': 'coverage',
                force: true,
                recursive: true
            }
        },
        groc: {
            options: {
                out: './'
            },
            javascript: [
                'src/*.js', 'README.md'
            ]
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'src/{,*/}*.js'
            ]
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            },
            unitAuto: {
                configFile: 'test/karma.conf.js',
                background: true
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'should'
                },
                src: ['test/nodifyTest.js']
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dist: {
                options: {
                    banner: '/* !!EnoFJS!! ' +
                        'Version: <%= pkg.version %>, ' +
                        'Author: <%= pkg.author %>, ' +
                        'Fork me on Github: https://github.com/EnoF/EnoFJS */',
                    mangle: {
                        except: ['Serializable', 'LinkedHashMap']
                    }
                },
                files: [
                    {
                        'dist/enofjs/min.enof.js': [
                            'src/node-shim.js',
                            'src/clazz.js',
                            'src/*.js'
                        ]
                    },
                    {
                        'dist/enofjs/min.clazz.js': 'src/clazz.js'
                    },
                    {
                        'dist/enofjs/min.node-shim.js': 'src/node-shim.js'
                    },
                    {
                        'dist/enofjs/min.LinkedHashMap.js': 'src/LinkedHashMap.js'
                    },
                    {
                        'dist/enofjs/min.Serializable.js': 'src/Serializable.js'
                    },
                    {
                        'dist/enofjs/min.ArrayConverters.js': 'src/ArrayConverters.js'
                    },
                    {
                        'dist/enofjs/min.whereIt.js': 'src/whereIt.js'
                    }
                ]
            }
        },
        version: {
            options: {
                prefix: 'Version: |\"version\": \"'
            },
            defaults: {
                src: [
                    '*.js',
                    'bower.json',
                    'src/{,*/}*.js',
                    'test/{,*/}*.js',
                    '!**/lib/**',
                    '!**/bower_components/**'
                ]
            }
        },
        watch: {
            karma: {
                files: [
                    'src/{,*/}*.js',
                    'test/spec/*Spec.js'
                ],
                tasks: ['karma:unitAuto:run']
            }
        }
    });

    grunt.registerTask('test', [
        'jshint',
        'karma:unit',
        'mochaTest:test',
        'uglify'
    ]);

    grunt.registerTask('default', [
        'karma:unitAuto',
        'watch'
    ]);
};
