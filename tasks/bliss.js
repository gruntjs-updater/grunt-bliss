/*
 * grunt-contrib-bliss
 *
 * Copyright (c) 2013 George Pantazis
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var _ = grunt.util._,
    Bliss = require('bliss'),
    helpers = require('grunt-lib-contrib').init(grunt);

  // content conversion for templates
  var defaultProcessContent = function(content) {
    return content;
  };

  // filename conversion for templates
  var defaultProcessName = function(name) {
    return name.replace('.js.html', '');
  };

  grunt.registerMultiTask('bliss', 'Compile bliss templates.', function() {

    var bliss = new Bliss();

    var options = this.options({
      separator: grunt.util.linefeed + grunt.util.linefeed
    });

    var data = options.data;
    delete options.data;

    var nsInfo;

    // assign transformation functions
    var processContent = options.processContent || defaultProcessContent;
    var processName = options.processName || defaultProcessName;

    this.files.forEach(function(f) {
      var templates = [];

      f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function(filepath) {
        var src = processContent(grunt.file.read(filepath));
        var compiled, filename;
        filename = processName(filepath);

        options = grunt.util._.extend(options, {
          filename: filepath
        });

        console.log(data);

        try {
          compiled = bliss.render('test/fixtures/bliss', data);
        } catch (e) {
          grunt.log.error(e);
          grunt.fail.warn('Bliss failed to compile ' + filepath + '.');
        }

        templates.push(compiled);
      });

      var output = templates;
      if (output.length < 1) {
        grunt.log.warn('Destination not written because compiled files were empty.');
      } else {
        grunt.file.write(f.dest, output.join(grunt.util.normalizelf(options.separator)));
        grunt.log.writeln('File "' + f.dest + '" created.');
      }
    });

  });

};