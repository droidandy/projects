'use strict';

var chalk = require('chalk');

//this will, in future, be a general middleware for response with some extensions

/**
 * Send Server Error
 */
exports.respondServerError = function (req, res) {
  res.status(500).send('Server Error');
};

/**
 * Send not found error
 */
exports.respondNotFound = function (req, res) {
  res.status(404).send('not Found');
};

/**
 * Respond with the result
 */
exports.respond = function (req, res) {
  res.json(req.response);
};

