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
        groc: {
            options: {
                out: ''
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
        shell: {
            prepare: {
                command: 'rm -rf src test .jshintrc bower.json package.json'
            },
            addDocs: {
                command: 'git add -A'
            },
            commit: {
                command: 'git commit -m "update groc docs"'
            },
            push: {
                command: 'git push origin master:gh-pages -f'
            },
            revert: {
                command: 'git reset --hard HEAD~1'
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

    grunt.registerTask('update', [
        'groc',
        'shell:prepare',
        'shell:addDocs',
        'shell:commit',
        'shell:push',
        'shell:revert'
    ]);

    grunt.registerTask('default', [
        'karma:unitAuto',
        'watch'
    ]);
};
