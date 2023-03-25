'use strict';

/**
 * Module dependencies
 */

var passport = require('passport');
var fbStrategy = require('passport-facebook').Strategy;
var users = require('../../controllers/users.controller');

module.exports = function (config) {
  // use facebook strategy
  // passport.use(new fbStrategy({
  //   clientID: config.facebook.clientID,
  //   clientSecret: config.facebook.clientSecret,
  //   callbackURL: config.facebook.callbackURL,
  //   profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
  //   passReqToCallback: true
  // }, 
  // function (req, accessToken, refreshToken, profile, done) {
  //   // Set the provider data and include tokens
  //   var providerData = profile._json;
  //   providerData.accessToken = accessToken;
  //   providerData.refreshToken = refreshToken;

  //   // Create the user OAuth profile
  //   var providerUserProfile = {
  //     firstName: profile.name.givenName,
  //     lastName: profile.name.givenName,
  //     displayName: profile.displayName,
  //     email: profile.emails ? profile.emails[0].value : undefined,
  //     profileImageURL: (profile.id) ? '//graph.facebook.com/' + profile.id + '/picture?type=large' : undefined,
  //     provider: 'facebook',
  //     providerIdentifierField: 'id',
  //     providerData: providerData
  //   };

  //   // Save the user OAuth profile
  //   users.saveOAuthUserProfile(req, providerUserProfile, done);

  //   return profile;

  // }));
};
