// EnoFJS
// Version: 4.0.0
//
// Copyright (c) 2014.
//
// Author Andy Tang
// Fork me on Github: https://github.com/EnoF/EnoFJS
'use strict';

module.exports = function(grunt) {
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
        files: [{
          'dist/enofjs/enof.min.js': [
            'src/clazz.js',
            'src/*.js'
          ]
        }, {
          'dist/enofjs/clazz.min.js': 'src/clazz.js'
        }, {
          'dist/enofjs/LinkedHashMap.min.js': 'src/LinkedHashMap.js'
        }, {
          'dist/enofjs/Serializable.min.js': 'src/Serializable.js'
        }, {
          'dist/enofjs/ArrayConverters.min.js': 'src/ArrayConverters.js'
        }, {
          'dist/enofjs/whereIt.min.js': 'src/whereIt.js'
        }]
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
          'package.json',
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
