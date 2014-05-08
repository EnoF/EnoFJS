// EnoFJS
// Version: 1.2.1
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
        uglify: {
            dist: {
                files: {
                    'dist/enofjs/min.class.js': [
                        'src/ClassFactory.js'
                    ],
                    'dist/enofjs/min.enof.js': [
                        'src/*.js'
                    ]
                }
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
        'uglify'
    ]);

    grunt.registerTask('default', [
        'karma:unitAuto',
        'watch'
    ]);
};
