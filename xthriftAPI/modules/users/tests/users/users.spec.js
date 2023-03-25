'use strict';

module.exports = {
  only: true,
  testFn: function (app) {
    var request = require('supertest');
    var chalk = require('chalk');
    var test = require('../../../core/lib/test');

    var message = 'testing /auth/signup';

    test.start(message);

    request(app)
      .post('/auth/signup')
      .expect(200)
      .send({
        'firstName': 'Pravin',
        'lastName': 'Bashyal',
        'email': 'pravin.ashyal@gmail.com',
        'username': 'pravnbashyal',
        'password': 'password',
        'avatar': 'somePic',
        'zipCode': '12345'
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
