'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: 'postgres://xthrift:saakaajula@xthrift.c8ojtbyuqol9.us-west-2.rds.amazonaws.com:5432/xthrift',
    options: {
      user:'xthrift',
      pass: 'saakaajula',
      host: 'xthrift.c8ojtbyuqol9.us-west-2.rds.amazonaws.com',
      port: 5432,
      dialect: 'postgres'
    },
    seed: 'false'
  },
  app: {
    title: defaultEnvConfig.app.title + ' -Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    callbackURL: '/api/auth/facebook/callback'
  },
  jwt: {
    secretOrKey: 'secret',
    issuer: 'xthrift',
    expiry: 24*60*60
  },
  aws: {
    accessKeyId: "AKIAJWP7XRUXXXJL4H4A",
    accessKeySecret: "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"
  }
};
