
'use strict';

var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var db = require('../../../../models/index');
var User = db.User;
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
var chalk = require('chalk');

module.exports = function (config) {
  	console.log("Inside jwt exports");
  // Local strategy
  var opts = {};
  // set options
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.jwt.secretOrKey;
  console.log("opts.jwt.FromRequest: ", opts.jwtFromRequest);
  console.log(config);
  opts.issuer = config.jwt.issuer;

//define the jwt strategy
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  	console.log("Inside jwt strategy");
    // done(null, jwt_payload);
    
    return User.findOne({where: {
      id: jwt_payload.sub
    }})
    .then(function (user) {
    	console.log("callback of User.findOne: ", user);
      if (!user) {
        throw new Error('user not found');
      }
      user = user.dataValues;
      user.password = undefined;
      return user;
    })
    .then(function (success) {
      done(null, success);
    })
    .then(null, function (err) {
      return done(err);
    })
    .done();
  }));
};
