
'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        'node': true,
        'esnext': false,
        'bitwise': true,
        'camelcase': false,
        'curly': true,
        'eqeqeq': true,
        'immed': true,
        'indent': 2,
        'latedef': true,
        'newcap': true,
        'noarg': true,
        'quotmark': 'single',
        'regexp': true,
        'undef': true,
        'unused': true,
        'strict': true,
        'trailing': true,
        'smarttabs': true,
        'white': true,
        'laxcomma': true,
        'asi': true,
        'sub': true
      },
      src: [
        'Gruntfile.js',
        '{model,routes,}/*.js'
      ],
      assets: [
        'public/javascripts/**/*.js',
        '!public/javascripts/vendor/**/*.js'
      ]
    },
    watch: {
      lint: {
        files: ['<%= jshint.src %>', '<%= jshint.assets %>'],
        tasks: ['jshint']
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          cwd: __dirname,
          ignore: ['node_modules/**'],
          ext: 'js',
          watch: ['model', 'routes', 'views'],
          delayTime: 1,
          legacyWatch: true
        }
      }
    },
    concurrent: {
      server: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  grunt.registerTask('default', 'server');
  grunt.registerTask('server', 'concurrent:server');


  require('load-grunt-tasks')(grunt);
};
