'use strict';

/**
 * Module dependencies
 */

var _ = require('lodash');
var path = require('path');
var config = require(path.resolve('./config/config'));
// var db = require('../../../../models/index');
// var User = db.User;

// update user details
exports.update = function (req, res) {
  // init user
  var user = req.user;
  
  if (user) {
    user = _.extend(user, req.body);
    user.displayName = user.firstName + ' ' + user.lastName;
  } else {
    // check credentials
    // update model
  }

};

// get users profile
exports.me = function (req, res) {
  res.status(200).json(req.user);
};
