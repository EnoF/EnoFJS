/*
 * Copyright (c) 2014.
 *
 * @Author Andy Tang
 */
'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        watch: {
            karma: {
                files: [
                    'src/{,*/}*.js',
                    'test/spec/*Spec.js'
                ],
                tasks: ['karma:unitAuto:run', 'groc']
            },
            groc: {
                files: [
                    'README.md'
                ],
                tasks: ['groc']
            }
        },
        groc: {
            options: {
                out: 'doc/'
            },
            javascript: [
                'src/ClassFactory.js', 'src/LinkedHashMap.js', 'README.md'
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
