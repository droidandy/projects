
'use strict';

/**
 * Define dependencies
 */
var Sequelize = require('sequelize');
var chalk = require('chalk');
var schema = require('./pictures.schema').init(Sequelize);
var path = require('path');

// get db connection from lib config
var sequelize = require(path.resolve('./config/lib/sequelize')).connect(Sequelize);

// define model
var Pictures = sequelize.define ( 'pictures',
  schema, {
  // Model tableName will be the same as the model name
  freezeTableName: true
  });

module.exports = Pictures;
