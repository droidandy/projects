
'use strict';

/**
 * Module dependencies.
 */
var config = require('../config');
// var sequelize = require('./sequelize');
var express = require('./express');
var chalk = require('chalk');

// Initialize Model
// sequelize.loadModels(seedDB);

// module.exports.loadModels = function loadModels() {
//   sequelize.loadModels();
// };

module.exports.init = function init(callback) {
  // Initialize express
  var app = express.init();
  // db to come from sequelize
  var db = {};
  app.then(function (Application) {
    callback(Application, db, config);
  });
};

// run tests
module.exports.test = function (app) {
  // Initialize test
  var test = express.initTestModules(app);
};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function (app, db, config) {
    console.log(config.files);

  //   // Start the app by listening on <port>
    app.listen(config.port, function () {

      // Logging initialization
      console.log('--');
      console.log(chalk.green('Listening on:\t\t\t'+ config.host + ':' + config.port));
      console.log(chalk.green(config.app.title));
      console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
      console.log(chalk.green('Port:\t\t\t\t' + config.port));
      console.log(chalk.green('Database:\t\t\t\t' + config.db.uri));
      console.log(chalk.green('App version:\t\t\t' + config.xthrift.version));
      console.log('--');

      if (callback) callback(app);

   });

  });
};

