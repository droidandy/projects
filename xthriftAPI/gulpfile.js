'use strict';

/**
 * Module dependencies
 */

var _ = require('lodash');
var defaultAssets = require('./config/assets/default');
var testAssets = require('./config/assets/test');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var runSequence = require('run-sequence');
var path = require('path');
var endOfLine = require('os').EOL;
var apidoc = require('gulp-apidoc');

// Set NODE_ENV to 'test'
gulp.task('env:test', function() {
  process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function() {
  process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function() {
  process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', function () {
  console.log(defaultAssets);
  return plugins.nodemon({
    script: 'server.js',
    nodeArgs: '--debug',
    ext: 'js',
    watch: _.union(defaultAssets.allJS, defaultAssets.config)
  });
});

// Connect for doc
gulp.task('connect', function () {
  return gulp.src('./doc/')
    .pipe(plugins.webserver({
      port: 8080,
      host: '0.0.0.0',
      fallback: './doc/index.html'
    }));
});

// watch doc
gulp.task('watchDoc', function () {
  gulp.watch(defaultAssets.allJS, ['apidoc']);
});

// Mocha test task
gulp.task('mocha', function (done) {
  var error;

  gulp.src('./server.js')
    .pipe(plugins.mocha({
      reporter: 'nyan',
      timeout: 10000
    }))
  .on('error', function (err) {
    error = err;
  })
  .on('end', function () {
    done();
  });
  
});

gulp.task('apidoc', function (done) {
  apidoc({
    src: 'modules/',
    dest: 'doc/',
  }, done);
});

// Watch Files For Changes
gulp.task('watch', function () {
  //Start livereload

  if (process.env.NODE_ENV === 'development') {
    gulp.watch(defaultAssets.allJS, ['dev']);
  } else if (process.env.NODE_ENV === 'test'){
    gulp.watch(defaultAssets.allJS, 'test');
  }

});

gulp.task('doc', function(done) {
  runSequence('apidoc', 'connect', 'watchDoc', done);
});

// JS lint
gulp.task('lint', function() {
  var assets = _.union(
    defaultAssets.gulpConfig,
    defaultAssets.allJS
    // testAssets.tests
  );

  return gulp.src(assets)
    .pipe(plugins.jshint({
        "node": true,
        "jasmine": true,
        "globals": {
          "Promise": true
        }
      }))
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.jshint.reporter('fail'));
});


// lint project files and build
gulp.task('build', function (done) {
  runSequence('env:dev', 'lint', 'apidoc', done);
});


// Run the project tests
gulp.task('test', function (done) {
  runSequence('env:test', 'lint', 'apidoc', 'nodemon', 'watch', done);
});

// Run the project in dev
gulp.task('dev', function (done) {
  runSequence('env:dev', 'lint', 'apidoc', 'nodemon', 'watch', done );

});

gulp.task('default', function (done) {
  runSequence('dev', done);
});

// Production mode
