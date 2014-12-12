/*
 * grunt-coffee-jshint
 * https://github.com/bmac/grunt-coffee-jshint
 *
 * Copyright (c) 2013 bmac
 * Licensed under the MIT license.
 */

'use strict';

var hintFiles = require("coffee-jshint/lib-js/hint");
var _ = require("underscore");

module.exports = function(grunt) {

    grunt.registerMultiTask('coffee_jshint', 'grunt wrapper for coffee-jshint', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({

            jshintOptions : [],
            withDefaults : true,
            globals : []
        });

        var files = this.filesSrc;

        this.filesSrc.forEach(function(filePath) {

          var errors = hintFiles([ filePath ], {

            options: options.jshintOptions,
            withDefaults: options.withDefaults,
            globals: options.globals

          }, false);

          if ((errors != null) && (errors.length > 0)) {

            grunt.log.writeln(filePath);

            errors.forEach(function(error) {

              error.forEach(function(e) {

                _.each(e, function(v, k) {

                  grunt.log.writeln(k + ": " + v);
                });
              });
            });
          }
        });
    });
};
