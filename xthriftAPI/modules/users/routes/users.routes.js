"use strict";

module.exports = function (app) {
	var router = require('express').Router(); 
  //User Routes
  var users = require("../controllers/users.controller");
  var passport = require("passport");

  console.log("loading user routes");

  //Setting up the users profile api
  // app.route("/users/me").get(
  //   passport.authenticate("jwt", {session:false}),
  //   users.me);
  // app.route("/api/users").put(users.update);
  // app.route("/api/users/account").delete(users.removeOAuthProvider);
  // app.route("/api/users/password").post(users.changePassword);
  // app.route("/users").get(users.list);


  router.get('/users/me', passport.authenticate('jwt', {session:false}), users.me);


  // preload the params
  router.param("userId", users.userByID);


	// app.route("/users")
	// 	.get(users.list);

	// app.route("/user/:userId")
	// 	.get(users.respondId)
	// 	.delete(users.deleteUser);

	router.get('/users', users.list);

	router.get('/user/:userId', users.respondId);
	router.delete('/user/:userId', users.deleteUser);

	return router;
};

/**
 * @api {get} /users/me     Get current user"s profile data
 * @apiHeader {String}     Authorization     Users jwt token recieved after login
 *
 * @apiHeaderExample    {json} Authorization header example
 *  {
 *      "Authorization": "JWT
 *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
 *  }
 * @apiName     getMe
 * @apiGroup    User
 *
 * @apiSuccess {JSON}   user            User data of registered user
 * @apiSuccess {String} user.id         Unique id of regisetered user
 * @apiSuccess {String} user.firstName  Firstname of the User
 * @apiSuccess {String} user.lastName   Lastname of the User
 * @apiSuccess {String} user.email      Email of the User
 * @apiSuccess {String} user.avatar     Avatar of the User
 * @apiSuccess {Array}  user.entity     Buyer or seller or Both
 * @apiSucess  {String} user.token      Token for validated user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "user": {
 *          "id": "123",
 *          "firstName": "Harry",
 *          "lastName": "Potter",
 *          "email": "doe.patronus@owlmail.hg",
 *          "username": "expectoPatronus",
 *          "avatar": "aws.sth.com/thestral.png",
 *          "stores": ["1", "2"],
 *          "entity": ["buyer"]
 *      }
 *     }
 *
 * @apiError    AuthorizationError  The authorization token is expired or invalid
 *
 * @apiErrorExample Authorization Error-Response
 *      HTTP/1.1 401 Unauthorized
 */

 /** 
  * @api {get} /user/:userId Get a user by Id
  * @apiName getUserById
  * @apiGroup    User
  * @apiHeader {String} Authorization    Users jwt token recieved after login
  *
  * @apiHeaderExample    {json} Authorization header example
  *  {
  *      "Authorization": "JWT
  *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
  *  }
  *
  * @apiParam    {String}    id  Unique Id of the user
  *
  * @apiSuccessExample Success-Response:
  *      HTTP/1.1 200 OK
  *     {
  *        "id": 2,
  *        "firstName": "Remus",
  *        "lastName": "Lupin",
  *        "email": "rlupin@alumni.hogwarts.edu",
  *        "username": "lonewolf",
  *        "avatar": "136",
  *        "stores": null,
  *        "coordinates": null,
  *        "zipCode": "34566",
  *        "createdAt": "2016-05-19T13:53:55.147Z",
  *      }
  *
  * @apiError  {String} Unauthorized Invalid token
  *      HTTP/1.1 401 Unauthorized
  
 */

 /** 
  * @api {get} /users List users
  * @apiName    getUsers
  * @apiGroup    User
  *
  * @apiHeader {String} Authorization    Users jwt token recieved after login
  *
  * @apiHeaderExample    {json} Authorization header example
  *  {
  *      "Authorization": "JWT
  *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
  *  }
  *
  * @apiSuccessExample Success-Response:
  *      HTTP/1.1 200 OK
  *      {
  *      	"users": [
  *            {
  *              id": 2,
  *              firstName": "Remus",
  *              lastName": "Lupin",
  *              email": "rlupin@alumni.hogwarts.edu",
  *              username": "lonewolf",
  *              avatar": "136",
  *              stores": null,
  *              coordinates": null,
  *              zipCode": "34566",
  *              createdAt": "2016-05-19T13:53:55.147Z",
  *              updatedAt": "2016-05-19T13:53:55.147Z"
  *            },
  *            {
  *              id": 8,
  *              firstName": "Harry",
  *              lastName": "Potter",
  *              email": "hpotter@hogwarts.edu",
  *              username": "dementorslayer",
  *              avatar": "121",
  *              stores": null,
  *              coordinates": null,
  *              zipCode": "34566",
  *              createdAt": "2016-05-19T13:53:55.147Z",
  *              updatedAt": "2016-05-19T13:53:55.147Z"
  *	          }
  *      	]
  *      }
  *
  * @apiError    AuthorizationError  The authorization token is expired or invalid
  *
  * @apiErrorExample Authorization Error-Response 
  *      HTTP/1.1 401 Unauthorized
  */

  /** 
   * @api {delete} /user/:userId Delete a user
   * @apiName deleteUserById
   * @apiGroup    User
   * @apiHeader {String} Authorization    Users jwt token recieved after login
   *
   * @apiHeaderExample    {json} Authorization header example
   *  {
   *      "Authorization": "JWT
   *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
   *  }
   *
   * @apiParam    {String}    id  Unique Id of the user
   *
   * @apiSuccessExample Success-Response:
   *      HTTP/1.1 200 OK
   *
   * @apiError  {String} Unauthorized Invalid token
   *      HTTP/1.1 401 Unauthorized
   
  */

