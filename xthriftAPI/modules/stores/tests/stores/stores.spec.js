
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
      .post('/stores')
      .set({
        'Authorization': 'JWT ' + config.jwt.testToken
      })
      .send({
        'name': 'thiftiasail',
        'details': 'shop for thrift stuffs',
        'phone': 12345,
        'email': 'thrit@aweome.sh',
        'address': '221B Baker Street',
        'city' : 'NY',
        'state': 'NY',
        'zipCode': 1234,
        'businessHours': {
          usual : {
            dayName: ['mon', 'tue', 'wed'],
            open: 0900,
            close: 1700
          },
          exceptions: [
            {
              dayName: 'sat',
              open: 1200,
              close: 1500
            }
          ]
        }
      })
      .end(function (err, res) {
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
