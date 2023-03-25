
'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: '',
    options: {
      user:'',
      pass: ''
    },
  },
  app: {
    title: defaultEnvConfig.app.title + ' -Production Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    callbackURL: '/api/auth/facebook/callback'
  }
};
