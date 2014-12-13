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

            globals : [],
            globallyIgnoredErrors : []
        });

        var files = this.filesSrc;

        this.filesSrc.forEach(function(filePath) {

          var errors = hintFiles([ filePath ], {

            options       : [],
            withDefaults  : true,
            globals       : options.globals

          }, false);

          if ((errors != null) && (errors.length > 0)) {

            var effectiveErrors = [];

            errors.forEach(function(errorEntry) {
              errorEntry.forEach(function(errorEntryEntry) {
                effectiveErrors.push(errorEntryEntry);
              });
            });

            effectiveErrors = _.filter(effectiveErrors, function(error) {

              return (!options.globallyIgnoredErrors.contains(error.code));
            });

            if (effectiveErrors.length > 0) {

              grunt.log.write("Errors in file ")
              grunt.log.writeln(filePath);

              _.each(effectiveErrors, function(error) {
                grunt.verbose.writeln(error.code + ": " + error.reason)
              });

              _.each(effectiveErrors, function(error) {
                grunt.verbose.writeln("Details:")
                _.each(error, function(v, k) {
                  grunt.verbose.writeln(k + ": " + v);
                });
              });

            } else {

              grunt.verbose.write(filePath + "... ");
              grunt.verbose.ok();
              grunt.verbose.writeln();
            }
          }
        });
    });
};
