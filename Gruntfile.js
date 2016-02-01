// Generated on 2015-04-28 using generator-ionic 0.7.3
'use strict';

var _ = require('lodash');
var path = require('path');
var cordovaCli = require('cordova');
var spawn = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn;

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig(require('./config/grunt'));

  // Register tasks for all Cordova commands
  _.functions(cordovaCli).forEach(function (name) {
    grunt.registerTask(name, function () {
      this.args.unshift(name.replace('cordova:', ''));
      // Handle URL's being split up by Grunt because of `:` characters
      if (_.contains(this.args, 'http') || _.contains(this.args, 'https')) {
        this.args = this.args.slice(0, -2).concat(_.last(this.args, 2).join(':'));
      }
      var done = this.async();
      var exec = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
      var cmd = path.resolve('./node_modules/cordova/bin', exec);
      var flags = process.argv.splice(3);
      var child = spawn(cmd, this.args.concat(flags));
      child.stdout.on('data', function (data) {
        grunt.log.writeln(data);
      });
      child.stderr.on('data', function (data) {
        grunt.log.error(data);
      });
      child.on('close', function (code) {
        code = code ? false : true;
        done(code);
      });
    });
  });

  // Since Apache Ripple serves assets directly out of their respective platform
  // directories, we watch all registered files and then copy all un-built assets
  // over to <%= yeoman.dist %>/. Last step is running cordova prepare so we can refresh the ripple
  // browser tab to see the changes. Technically ripple runs `cordova prepare` on browser
  // refreshes, but at this time you would need to re-run the emulator to see changes.
  grunt.registerTask('ripple', ['wiredep', 'newer:copy:app', 'ripple-emulator']);
  grunt.registerTask('ripple-emulator', function () {
    grunt.config.set('watch', {
      all: {
        files: _.flatten(_.pluck(grunt.config.get('watch'), 'files')),
        tasks: ['newer:copy:app', 'prepare']
      }
    });

    var cmd = path.resolve('./node_modules/ripple-emulator/bin', 'ripple');
    var child = spawn(cmd, ['emulate']);
    child.stdout.on('data', function (data) {
      grunt.log.writeln(data);
    });
    child.stderr.on('data', function (data) {
      grunt.log.error(data);
    });
    process.on('exit', function (code) {
      child.kill('SIGINT');
      process.exit(code);
    });

    return grunt.task.run(['watch']);
  });

  // Dynamically configure `karma` target of `watch` task so that
  // we don't have to run the karma test server as part of `grunt serve`
  grunt.registerTask('watch:karma', function () {
    var karma = {
      files: ['<%= yeoman.test %>/unit/**/*.js'],
      tasks: ['newer:jshint:test', 'karma:unit:run']
    };
    grunt.config.set('watch', karma);
    return grunt.task.run(['watch']);
  });

  // Wrap ionic-cli commands
  grunt.registerTask('ionic', function() {
    var done = this.async();
    var script = path.resolve('./node_modules/ionic/bin/', 'ionic');
    var flags = process.argv.splice(3);
    var child = spawn(script, this.args.concat(flags), { stdio: 'inherit' });
    child.on('close', function (code) {
      code = code ? false : true;
      done(code);
    });
  });

  grunt.registerTask('test', [
    'wiredep',
    'clean',
    'concurrent:test',
    'autoprefixer',
    'karma:unit:start',
    'watch:karma'
  ]);

  grunt.registerTask('serve', function (target) {
    if (target === 'compress') {
      return grunt.task.run(['compress', 'ionic:serve']);
    }

    grunt.config('concurrent.ionic.tasks', ['ionic:serve', 'watch']);
    grunt.task.run(['wiredep', 'init', 'concurrent:ionic']);
  });
  grunt.registerTask('emulate', function() {
    grunt.config('concurrent.ionic.tasks', ['ionic:emulate:' + this.args.join(), 'watch']);
    return grunt.task.run(['init', 'concurrent:ionic']);
  });
  grunt.registerTask('run', function() {
    grunt.config('concurrent.ionic.tasks', ['ionic:run:' + this.args.join(), 'watch']);
    return grunt.task.run(['init', 'concurrent:ionic']);
  });
  grunt.registerTask('build', function() {
    return grunt.task.run(['init', 'ionic:build:' + this.args.join()]);
  });

  grunt.registerTask('init', [
    'clean',
    'ngconstant:development',
    'wiredep',
    'concurrent:server',
    'autoprefixer',
    'newer:copy:app',
    'newer:copy:tmp'
  ]);


  grunt.registerTask('compress', [
    'clean',
    'ngconstant:production',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('coverage',
    ['karma:continuous',
    'connect:coverage:keepalive'
  ]);

  grunt.registerTask('default', [
    'wiredep',
    'newer:jshint',
    'karma:continuous',
    'compress'
  ]);
};
