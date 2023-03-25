'use strict';

/**
 * Define dependencies
 */

var Sequelize = require('sequelize');
var path = require('path');
var config = require(path.resolve('./config/config'));
var chalk = require('chalk');
var schema = require('./deals.schema').init(Sequelize);

// get db connection from lib config
var sequelize = require(path.resolve('./config/lib/sequelize')).connect(Sequelize);

// define model
var Deals = sequelize.define ('deals', schema, {
  // Model tableName will be the same as the model name
  freezeTableName: true
});

module.exports = Deals;
