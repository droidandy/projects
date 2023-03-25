

'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    // local test uri
    uri: 'postgres://pravin:saakaajula@localhost:5434/xthrift',
    options: {
      user:'',
      pass: ''
    },
  },
  app: {
    title: defaultEnvConfig.app.title + ' -Test Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    callbackURL: '/api/auth/facebook/callback'
  },
  jwt: {
    secretOrKey: 'secret',
    issuer: 'xthrft',
    expiry: 365*24*60*60,
    testToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiUHJhdmluIiwibGFzdE5hbWUiOiJCYXNoeWFsIiwiZW1haWwiOiJwcmFpbi5zaHlpaWFsQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoicGloeWFsIiwicGFzc3dvcmQiOiIkMmEkMTAkcG1GUFRBVFhQZm1tVzhqTHRKTHY4dW9QYnB5OUJoV1JhN0R3YVBPSUxuaS5lYlpGenJlU20iLCJhdmF0YXIiOiJzb21lUGljIiwic3RvcmVzIjpudWxsLCJjcmVhdGVkQXQiOiIyMDE2LTAzLTA2VDA2OjU1OjQ3LjU1OVoiLCJ1cGRhdGVkQXQiOiIyMDE2LTAzLTA2VDA2OjU1OjQ3LjU1OVoiLCJpYXQiOjE0NTcyNDgwMjYsImlzcyI6Inh0aHJmdCIsInN1YiI6MX0.PVTQ3VfzJFDsFoZus2qv-acsNCZ3UDtlhZSeJiH8qBk"
  },
  aws: {
    accessKeyId: "AKIAJWP7XRUXXXJL4H4A",
    accessKeySecret: "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"
  }
};
