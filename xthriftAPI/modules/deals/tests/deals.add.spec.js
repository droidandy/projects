

'use strict';

module.exports = {
  only: false,
  testFn: function (app) {
    var request = require('supertest');
    var path = require('path');
    var config = require(path.resolve('./config/config'));
    var chalk = require('chalk');
    var test = require('../../core/lib/test');

    var message = 'testing /store/id/deals';

    test.start(message);

    request(app)
      .post('/store/1/deals')
      .set({
        "Authorization": "JWT " + config.jwt.testToken
      })
      .send({
        "name": "grand",
        "details": "sale of wands",
        "images": [ "1", "2", "3"]
      })
      .end(function (err, res) {
        if (err){ 
          test.fail(message, err);
        } else {
          test.pass(message);
          console.log(chalk.green('res'), res.body);
        }
      });

  }
};
