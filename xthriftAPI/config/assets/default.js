'use strict';

module.exports = {
  gulpConfig: 'gulpfile.js',
  allJS: ['server.js', 'config/**/*.js', 'modules/**/*.js'],
  models: 'modules/*/models/**/*.model.js',
  seeds: 'modules/*/models/**/*.seed.js',
  routes: ['modules/*/routes/**/*.js'], 
  config: 'modules/*/config/*.js',
  test: ['modules/*/tests/**/*.js']
};
