'use strict';

/**
 * Module Dependencies
 */
var path = require('path');
var passport = require('passport');
var config = require(path.resolve('./config/config'));

/**
 * Initialize module
 */
module.exports = function (app) {
  // Initialize strategies
  config.utils
    .getGlobbedPaths(path.join(__dirname, './strategies/*.js'))
    .forEach(function (strategy) {
      console.log(strategy);
      require(path.resolve(strategy))(config);
    });

  // Add passport's middleware
  app.use(passport.initialize());
};
