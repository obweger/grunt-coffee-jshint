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

    var cyan = function(str) {
      return grunt.log.wordlist([ str ], { color : 'cyan' });
    }

    var red = function(str) {
      return grunt.log.wordlist([ str ], { color : 'red' });
    }

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

            _.each(effectiveErrors, function(error) {

              if (!(options.globallyIgnoredErrors.indexOf(error.code) >= 0)) {

                grunt.log.writeln("Error in file " + cyan(filePath));
                grunt.log.writeln(red(error.code + ": " + error.reason + " (line " + error.line + ", character " + error.character + ")"));

                // log details in verbose mode
                grunt.verbose.writeln("Details:");
                _.each(error, function(v, k) {
                  grunt.verbose.writeln(" - Property " + k + ": " + v);
                });

                grunt.fail.warn("Error in file " + filePath);

              } else {

                grunt.log.writeln("Globally ignored error " + cyan(error.code) + " in file " + cyan(filePath));
              }
            });
          }
        });
    });
};
