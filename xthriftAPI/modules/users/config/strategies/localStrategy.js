'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../../../../models/index');
var User = db.User;
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
var jwt = require('jsonwebtoken');
var chalk = require('chalk');

module.exports = function (config) {
  // Local strategy
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, function(username, password, done) {
  	console.log("Inside LocalStrategy");

    // find the user with username
    return User.findOne({ where: {username: username} })
      // verify the password hash
      .then( function (user) {

        if (!user) {
          throw new Error('user not found');
        }
        this.user = user.dataValues;
        return bcrypt.compareAsync(password, this.user.password);
      })
      .then(function (isVerified) {
        if(isVerified) {

          console.log(chalk.green('User Verified'), this.user.username);

          // create token
          var opts = {
            issuer: config.jwt.issuer,
            expirersIn: config.jwt.expiry,
            subject: this.user.id,
          };

          var token = jwt.sign(this.user, config.jwt.secretOrKey, opts);
          this.user.token = token;

          // clear sensitive data
          this.user.password = undefined;
          return this.user;
        } else {
          throw new Error('user password mismatch');
        }
      })

      .then(function (success) {
        return done(null, success);
      })
      
      .then(null, function (err) {
        return done(err);
      })
      .done();
  }));
};
