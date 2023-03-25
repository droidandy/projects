'use strict';

module.exports = {
  only: false,
  testFn: function (app) {
    var request = require('supertest');
    var chalk = require('chalk');
    var test = require('../../../core/lib/test');

    var message = 'testing /auth/signin';

    test.start(message);

    request(app)
      .post('/auth/signin')
      .send({
        'username': 'pravinbashyal',
        'password': 'password'
      })
      .end(function (err, res) {
        if (err){ 
          test.fail(message, err);
        } else {
          test.pass(message);
          console.log(res.body);
        }
      });
  }
};
