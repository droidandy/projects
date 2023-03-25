'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');
var db = require('../../../../models/index');
var User = db.User;
var jwt = require('passport-jwt');
var passport = require('passport');
var chalk = require('chalk');



/**
 * User middlewares
 */

// grab user by ID
exports.userByID = function (req, res, next, id) {
  // check id validity
  // get user by id
  User.findById(id)
    .then( function (user) {
      // attach the user to global req obj
      req.profile = user.dataValues;
      return next();
    })
    .then(null, next)
    .done();
};

exports.respondId = function (req, res) {
  res.status(200).json(req.profile);
};

// authenticate users
exports.jwtAuth = function ( config ) {
  // jwt strategy
  var jwtStrategy = jwt.Strategy;
  var extractJwt = jwt.ExtractJwt;
  
  // default options
  var defaultOpts = config.jwt.opts;
  var currentOpts = {};

  currentOpts.jwtFromRequest = extractJwt.fromAuthHeader();

  // merge options
  var opts = _.merge(defaultOpts, currentOpts);

  passport.use( new jwtStrategy (opts, function (jwtPayload, done) {
    if (jwtPayload) {
      //success
      // next();
    } else {
      // next(new Error());
    }
  }));
};

//for testing purpose only
exports.checkPayload = function (req, res) {
  console.log(chalk.green('user payload'), req.user);
};
// upload token for amazon upload
exports.createUploadToken = function (req, res, next) {

};

// user token for authentication in the future
exports.createUserToken = function (req, res, next) {
  
};

