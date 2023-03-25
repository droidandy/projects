
// 'use strict';

/**
 * Module dependencies
 */
var passport = require('passport');

module.exports = function (app) {
	var router = require('express').Router(); 
  var controller = require('../controllers/pictures.controller');
  var respond = require('../../core/controllers/core.controller').respond;

  var multer = require('multer');
  var upload = multer({dest: 'uploads/'});

  // app.route('/pictures')
  //   .post(
  //     // passport.authenticate('jwt', {session: false}),
  //     controller.addPicture
  //   );
	router.get('/pictures', controller.list);

	router.post('/pictures', controller.addPicture);

	router.post('/pictures/stores', 
		// controller.uploadStores, 
		upload.array('pictures'),
		controller.uploadToAmazon, 
		controller.deleteImage,
		controller.pushToDb,
		function (req, res, next) {
			console.log('finale', req.images);
			res.json({images: req.images});
		}
	);
	router.get('/picture/:picId', controller.respondId);
	router.param('picId', controller.getPictureById);	

  // app.route('/pictures/stores')
  //   .post(
  //     controller.uploadStores(),
  //     controller.uploadToAmazon,
  //     controller.deleteImage,
  //     controller.pushToDb,
  //     function (req, res, next) {
  //       console.log('finale', req.images);
  //       res.json({images: req.images});
  //     }
  //       );

  // app.route('/picture/:picId')
  //   .get(
  //   // passport.authenticate('jwt', {session: false}),
  //     controller.respondId);

// preload picture
  
  // app.param('type', controller.getType);

  return router;
};

/** 
 *
 * API doc
 *
 */

/**
 * @api {post} /pictures Post or get Pictures
 * @apiName postPicture
 * @apiGroup    Pictures
 *
 * @apiParam    {String} params  params for post
 * @apiParam    {String} params.Bucket  Bucket to put the object 
 * @apiParam    {String} params.Key  Key of the object to put
 * @apiParam    {String} params.Expires   Expiration period of the url in seconds
 * @apiParam    {String}    type    The picture type that it belongs to.('DEAL', 'AVATAR', 'STORE')
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *      "params": {
 *          "Bucket": "my-bucket",
 *          "Key": "110ec58a-a0f2-4ac4-8393-c866d813b8d1",
 *          "Expires": "3600"
 *          },
 *        "type":"DEAL" 
 *     }
 *
 * @apiSuccess {JSON} data   data returned from the api
 * @apiSuccess {String} data.id     unique id of picture
 * @apiSuccess {JSON} data.ImageKeys    Image Keys of different type of images
 * @apiSuccess {String} data.ImageKeys.thumbnail    Image Keys of type thumbnail
 * @apiSuccess {String} data.ImageKeys.small    Image Keys of type small
 * @apiSuccess {String} data.ImageKeys.medium    Image Keys of type medium
 * @apiSuccess {String} data.ImageKeys.large    Image Keys of type large
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data":
 *          {
 *             "id": 12,
 *             "imageKeys": {
 *              "thumbnail": "thumbnail-myKey",
 *              "small": "small-myKey",
 *              "medium": "medium-myKey",
 *              "large": "large-myKey",
 *             }
 *             "type":"DEAL",
 *             "updatedAt":"2016-03-01T08:43:06.766Z",
 *             "createdAt":"2016-03-01T08:43:06.766Z"
 *          }
 *     }
 *
 * @apiError Unauthorized  Invalid JWT token 
 *
 * @apiErrorExample Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 */

/**
 * @api {get} /picture/:picId   Get a picture by Id
 * @apiName getPictureById
 * @apiGroup    Pictures
 * @apiHeader {String} Authorization    Users jwt token recieved after login
 *
 * @apiHeaderExample    {json} Authorization header example
 *  {
 *      "Authorization": "JWT
 *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
 *  }
 *
 * @apiParam    {String}    id  Unique Id of the picture
 *
 * @apiSuccess    {String}    id    Unique Id of the picture
 * @apiSuccess    {String}    url   Url of the Image 
 * @apiSuccess    {String}    type  Type of the image(DEAL/STORE) Details of the Store
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *         "id": "1",
 *         "url": "https://xthrift-conv.s3-us-west-2.amazonaws.com/image",
 *         "type":"DEAL", 
 *         "createdAt":"2016-03-01T08:35:19.461Z",
 *         "updatedAt":"2016-03-01T08:35:19.461Z"
 *      }
 *
 * @apiError  {String} Unauthorized Invalid token
 *      HTTP/1.1 401 Unauthorized
 *
 */
