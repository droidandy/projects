
'use strict';

module.exports = {
  only: false,
  testFn: function (app) {
    var request = require('supertest');
    var path = require('path');
    var chalk = require('chalk');
    var test = require('../../core/lib/test');

    var message = 'testing /s3url/post';

    test.start(message);

    request(app)
      .get('/s3url/1/post')
      .set({
        'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NjMsImZpcnN0TmFtZSI6IlByYXZpbiIsImxhc3ROYW1lIjoiQmFzaHlhbCIsImVtYWlsIjoicHJhaW4uc2h5aWlhbEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InBpaHlhbCIsInBhc3N3b3JkIjoiJDJhJDEwJEk2anlLTktwNVNwV2YxcHdDT3FnN09SYXlmaDM2V0dQOFNYaG1NRUFpa1NPWktIcnk0YlJhIiwiYXZhdGFyIjoic29tZVBpYyIsInN0b3JlcyI6WyIxMiJdLCJjcmVhdGVkQXQiOiIyMDE2LTAyLTI1VDE0OjI1OjA2LjEzOVoiLCJ1cGRhdGVkQXQiOiIyMDE2LTAyLTI5VDE5OjM0OjAxLjA2MVoiLCJpYXQiOjE0NTY3ODk5MTUsImlzcyI6Inh0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ'
      })
      .end(function (err, res) {
        if (err){ 
          test.fail(message, err);
        } else {
          test.pass(message);
          console.log(res.body);
        }
      });

    // message = 'testing User creation';

    // test.start(message);
    // request(app)
    //   .get('/api/auth/signup')
    //   .expect(200);
  }
};
