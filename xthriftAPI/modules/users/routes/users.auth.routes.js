// "use strict";

/**
 * Module dependencies
 */
var passport = require("passport");
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

module.exports = function (app) {

	var router = require('express').Router(); 

  var users = require("../controllers/users.controller");
  var respond = require("../../core/controllers/core.controller").respond;

//   // users password api
//   app.route("/api/auth/forgot").post(users.forgot);
//   app.route("/api/auth/reset/:token").get(users.validateResetToken);
//   app.route("/api/auth/reset/:token").post(users.reset);
  // app.route("/auth/signup").post(users.signup);
  // app.route("/auth/signup").post(
  //   users.uploadAvatar(),
  //   users.uploadToAmazon,
  //   users.deleteImage,
  //   users.savePicture,
  //   users.signup
  // );

  router.post('/auth/signup',
  	upload.single('avatar'),
  	users.uploadToAmazon,
  	users.deleteImage,
  	users.savePicture,
  	users.signup
  	);
  /*
  Example CURL:
  curl -v -F "firstName=Ash" -F "lastName=Ketchum" -F "email=aketchum@pokedex.com" -F "username=aketchum" "http://http://xthrift-env.us-west-2.elasticbeanstalk.com/api/v1/auth/signup"
  */

  // app.route("/auth/signin").post(users.signin);

  router.post('/auth/signin', users.signin);
  // passport.authenticate("local", {
  //   session: false
  // }),
  // users.serialize, respond

// for test purpose only
  // app.route("/auth/jwt")
  //   .post(passport.authenticate("jwt", {session: false}), users.checkPayload);

    router.post('/auth/jwt', passport.authenticate('jwt', {session: false}), users.checkPayload);

//   // facebook oauth routes
//   app.route("/api/auth/facebook").get(users.oauthCall("facebook", {
//     scope: ["email"]
//   }));
//   app.route("/api/auth/facebook/callback").get(users.oauthCallback("facebook"));
	return router;
};

/**
 *
 * API doc
 *
 */

/**
 * @api {post} /auth/signup Sign up user
 * @apiName postUser
 * @apiGroup User
 *
 * @apiParam    {String}    firstName   Firstname of the user.
 * @apiParam    {String}    lastName    Lastname of the user
 * @apiParam    {String}    email       Email of the user
 * @apiParam    {String}    username    Username of the user
 * @apiParam    {String}    password    Password of the user
 * @apiParam    {String}    zipCode     Zipcode of the user address
 * @apiParam    {JSON}      coordinates geolocation coordinates for the user
 * @apiParam    {String}    [avatar]    Url to profile picture of the user
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *        "firstName": "John",
 *        "lastName": "Smith",
 *        "email": "john.smith@fakemail.com",
 *        "username": "jsmith",
 *        "password": "x#sjf%sjd",
 *        "zipCode": "92612",
 *        "coordinates": {
 *          "lat": "0.234234287",
 *          "long": "0.42384274"
 *        }
 *        "avatar": "aws.sth.com/jsmith.png",
 *     }
 *
 * @apiSuccess {String} user              User data of registered user
 * @apiSuccess {String} user.id           Unique id of regisetered user
 * @apiSuccess {String} user.firstName    User's Firstname
 * @apiSuccess {String} user.lastName     User's Lastname
 * @apiSuccess {String} user.email        User's Email
 * @apiSuccess {String} user.username     User's Username
 * @apiSuccess {String} user.zipCode      User's Zipcode
 * @apiSuccess {String} user.coordinates  User's locaiton coordinates
 * @apiSuccess {String} user.avatar       Users's Avatar
 * @apiSuccess {String} user.token        User's valid token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "user": {
 *          "id": "123",
 *          "firstName": "John ",
 *          "lastName": "Smith",
 *          "email": "john.smith@fakemail.com",
 *          "username": "jsmith",
 *          "avatar": "aws.sth.com/jsmith.png",
 *          "zipCode": "92612",
 *          "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NjMsImZpcnN0TmFtZSI6IlByYXZpbiIsImxhc3ROYW1lIjoiQmFzaHlhbCIsImVtYWlsIjoicHJhaW4uc2h5aWlhbEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InBpaHlhbCIsInBhc3N3b3JkIjoiJDJhJDEwJEk2anlLTktwNVNwV2YxcHdDT3FnN09SYXlmaDM2V0dQOFNYaG1NRUFpa1NPWktIcnk0YlJhIiwiYXZhdGFyIjoic29tZVBpYyIsInN0b3JlcyI6WyIxMiJdLCJjcmVhdGVkQXQiOiIyMDE2LTAyLTI1VDE0OjI1OjA2LjEzOVoiLCJ1cGRhdGVkQXQiOiIyMDE2LTAyLTI5VDE5OjM0OjAxLjA2MVoiLCJpYXQiOjE0NTY3ODU5NzgsImlzcyI6Inh0aHJmdCIsInN1YiI6NjN9.xzTwy1Ml7f_kEf3Nrf0tQMsyVFutIuEr5x3jdnAF2L0"
 *      }
 *     }
 *
 * @apiError ValidationError    The username/email is already registered
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      "message": "username must be unique",
 *      "type": "unique violation",
 *      "path": "username",
 *      "value": "jsmith"
 *     }
 */

/**
 * @api {post} /auth/signin Sign in user
 * @apiName Login User
 * @apiGroup User
 *
 * @apiParam    {String}    username    User's username
 * @apiParam    {String}    password    User's password
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *        "username": "jsmith",
 *        "password": "x#sjf%sjd",
 *     }
 *
 * @apiSuccess {String} user    user data of registered user
 * @apiSuccess {String} token   jwt token of logged in account user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "123",
 *         "firstName": "Harry",
 *         "lastName": "Potter",
 *         "email": "doe.patronus@owlmail.hg",
 *         "username": "expectoPatronus",
 *         "zipCode": "12345",
 *         "coordinates" {
 *           "lat": "0.234234287",
 *           "long": "0.42384274"
 *         }
 *         "avatar": "aws.sth.com/thestral.png",
 *         "stores": ["12"],
 *         "entity": ["buyer"]
 *         "createdAt": "2016-02-25T14:25:06.139Z",
 *         "updatedAt": "2016-02-29T19:34:01.061Z",
 *         "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NjMsImZpcnN0TmFtZSI6IlByYXZpbiIsImxhc3ROYW1lIjoiQmFzaHlhbCIsImVtYWlsIjoicHJhaW4uc2h5aWlhbEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InBpaHlhbCIsInBhc3N3b3JkIjoiJDJhJDEwJEk2anlLTktwNVNwV2YxcHdDT3FnN09SYXlmaDM2V0dQOFNYaG1NRUFpa1NPWktIcnk0YlJhIiwiYXZhdGFyIjoic29tZVBpYyIsInN0b3JlcyI6WyIxMiJdLCJjcmVhdGVkQXQiOiIyMDE2LTAyLTI1VDE0OjI1OjA2LjEzOVoiLCJ1cGRhdGVkQXQiOiIyMDE2LTAyLTI5VDE5OjM0OjAxLjA2MVoiLCJpYXQiOjE0NTY3ODU5NzgsImlzcyI6Inh0aHJmdCIsInN1YiI6NjN9.xzTwy1Ml7f_kEf3Nrf0tQMsyVFutIuEr5x3jdnAF2L0"
 *      }
 *
 * @apiError Credential Error The username/password mismatch
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *      "error": "Credentials error"
 *     }
 */
