'use strict';

/** 
 * Module Dependencies
 */
var config = require('../config');
var chalk = require('chalk');
var path = require('path');

//Initialize sequelize
module.exports.connect = function (Sequelize) {
  console.log("database", config.db.uri);
  var sequelize =  new Sequelize(config.db.uri, config.db.options);
  return sequelize;
};

