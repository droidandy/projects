
'use strict';

module.exports = {
  only: false,
  testFn: function (app) {
    var request = require('supertest');
    var chalk = require('chalk');
    var test = require('../../../core/lib/test');
    var path = require('path');
    var config = require(path.resolve('./config/config'));

    var message = 'testing /store';

    test.start(message);

    request(app)
      .get('/store/1')
      .set({
        'Authorization': 'JWT ' + config.jwt.testToken
      })
      .end(function (err, res) {
        console.log(res.body);
        if (err){ 
          test.fail(message, err);
        } else {
          test.pass(message);
        }
      });

    // message = 'testing User creation';

    // test.start(message);
    // request(app)
    //   .get('/api/auth/signup')
    //   .expect(200);
  }
};
