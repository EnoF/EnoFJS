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
                tasks: ['karma:unitAuto:run']
            }
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
        }
    });

    grunt.registerTask('test', [
        'jshint',
        'karma:unit'
    ]);

    grunt.registerTask('default', [
        'karma:unitAuto',
        'watch'
    ]);
};
