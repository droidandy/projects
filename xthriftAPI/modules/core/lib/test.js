'use strict';
/** 
 * Module dependencies
 */

var chalk = require('chalk');

//display pass message
exports.pass = function (message, res) {
  console.log(chalk.green('**','passed: ', message, '**'));
  console.log(chalk.green('**','response: ', res, '**'));
};

//display fail message
exports.fail = function (message, err) {
  console.log(chalk.red('**','failed: ', message, '**'));
  console.log(chalk.red(err)); 
};

exports.start = function (message) {
  console.log(chalk.white('**', message, "**"));
};

exports.describe = function (message, cb) {
  var _this = this;

  return cb();
};
