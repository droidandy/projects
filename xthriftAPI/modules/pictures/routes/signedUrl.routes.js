'use strict';

module.exports = function (app) {

	var router = require('express').Router(); 
  var controller = require('../controllers/signedUrl.controller.js');
  var passport = require('passport');
  router.get('/s3url/:type/:imageId/:getType', controller.signUrl);
    // .get(
    // // passport.authenticate('jwt', {session: false}), 
    // controller.signUrl);

  // app.route('/s3url/get/:imageId')
  //   .get(
  //   passport.authenticate('jwt', {session: false}), 
  //   controller.getAllSignUrl);
  router.get('/s3url/:type', controller.signUrl);
    // .get(controller.signUrl);
  
  // preload image keys
  router.param('imageId', controller.imageNames);

  return router;
};

/**
 *
 * API doc
 *
 */

/**
 * @api {get} /s3url/post  get signed url for posting s3 object 
 * @apiName getPostSignedUrl
 * @apiGroup    Pictures
 * @apiHeader {String} Authorization    Users jwt token recieved after login
 *
 * @apiHeaderExample    {json} Authorization header example
 *  {
 *      "Authorization": "JWT
 *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
 *  }
 *
 * @apiSuccess {String} url signedUrl for post
 * @apiSuccess {String} params  params for post
 * @apiSuccess {String} params.Bucket  Bucket to put the object 
 * @apiSuccess {String} params.Key  Key of the object to put
 * @apiSuccess {String} params.Expires   Expiration period of the url in seconds
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "url":"https://xthrift-conv.s3-us-west-2.amazonaws.com/image?AWSAccessKeyId=AKIAJOTNTHRKCKZ3HZ7A&Expires=1456814260&Signature=mT9aKzEIEFFd0tCqLEKNJr6J8SM%3D",
 *      "params": {
 *          "Bucket": "my-bucket",
 *          "Key": "110ec58a-a0f2-4ac4-8393-c866d813b8d1",
 *          "Expires": "3600"
 *          }
 *      }
 *
 * @apiError  {String} Unauthorized Invalid token
 *      HTTP/1.1 401 Unauthorized
 *
 */

/**
 * @api {get} /s3url/get/:imageId/:type  get signed url for getting s3 object 
 * @apiName getGetSignedUrl
 * @apiGroup    Pictures
 * @apiHeader {String} Authorization    Users jwt token recieved after login
 *
 * @apiHeaderExample    {json} Authorization header example
 *  {
 *      "Authorization": "JWT
 *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
 *  }
 *
 * @apiParam    {imageId}    imageId    Id of image to get from s3.
 * @apiParam    {type}    type  Type of image to get from s3.['thumbnail', 'small', 'medium', 'large']
 *
 * @apiSuccess {String} url signedUrl for get
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "url":"https://xthrift-conv.s3-us-west-2.amazonaws.com/image?AWSAccessKeyId=AKIAJOTNTHRKCKZ3HZ7A&Expires=1456814260&Signature=mT9aKzEIEFFd0tCqLEKNJr6J8SM%3D"
 *      }
 *
 * @apiError  {String} Unauthorized Invalid token
 *      HTTP/1.1 401 Unauthorized
 *
 */

/**
 * @api {get} /s3url/:imageId  get signed url for getting s3 object (toDo)
 * @apiName getSignedUrl
 * @apiGroup    Pictures
 * @apiHeader {String} Authorization    Users jwt token recieved after login
 *
 * @apiHeaderExample    {json} Authorization header example
 *  {
 *      "Authorization": "JWT
 *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
 *  }
 *
 * @apiParam    {getType}    type  Type of image to get from s3.
 *
 * @apiSuccess {String} url signedUrl for get
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "thumbnail":"https://xthrift-conv.s3-us-west-2.amazonaws.com/image?AWSAccessKeyId=AKIAJOTNTHRKCKZ3HZ7A&Expires=1456814260&Signature=mT9aKzEIEFFd0tCqLEKNJr6J8SM%3D",
 *      "small":"https://xthrift-conv.s3-us-west-2.amazonaws.com/image?AWSAccessKeyId=AKIAJOTNTHRKCKZ3HZ7A&Expires=1456814260&Signature=mT9aKzEIEFFd0tCqLEKNJr6J8SM%3D",
 *      "medium":"https://xthrift-conv.s3-us-west-2.amazonaws.com/image?AWSAccessKeyId=AKIAJOTNTHRKCKZ3HZ7A&Expires=1456814260&Signature=mT9aKzEIEFFd0tCqLEKNJr6J8SM%3D",
 *      "large":"https://xthrift-conv.s3-us-west-2.amazonaws.com/image?AWSAccessKeyId=AKIAJOTNTHRKCKZ3HZ7A&Expires=1456814260&Signature=mT9aKzEIEFFd0tCqLEKNJr6J8SM%3D"
 *      }
 *
 * @apiError  {String} Unauthorized Invalid token
 *      HTTP/1.1 401 Unauthorized
 *
 */

