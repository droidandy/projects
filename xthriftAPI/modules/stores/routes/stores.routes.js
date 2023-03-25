"use strict";
var passport = require("passport");
module.exports = function (app) {
  var router = require('express').Router(); 
  // dependencies
  var controller = require("../controllers/stores.controller.js");
  var respond = require("../../core/controllers/core.controller.js").respond;
  
  var chalk = require("chalk");

  
    router.post('/stores', passport.authenticate("jwt", {session: false}), controller.addStore, respond );
    // .get(
    // passport.authenticate("jwt", {session: false}), 
    // controller.list);
	router.get('/stores', controller.list);

    // router.get('/stores', controller.list);
    // router.post('/stores', controller.addStore, respond);
	
	router.param("storeId", controller.storeById);

// app.route("/store/:storeId")
//     // .get(
//     // passport.authenticate("jwt", {session: false}), 
//     // controller.respondId)

// 	.get(controller.respondId)

//     .put(controller.updateStore)
//     .delete();

    router.get('/store/:storeId', controller.respondId);
    router.put('/store/:storeId', controller.updateStore);

    // app.route("/store/:storeId/deals")
    // .get(controller.getStoreDeals);

  // app.route("/s3url/:type").get( function (req, res, next) {
  //   res.send(req.params.type);
  // } );

  return router;
};


/** 
 *
 * API doc
 *
 */

/** 
 * @api {get} /stores  Get stores
 * @apiHeader {String} Authorization    Users jwt token recieved after login
 *
 * @apiHeaderExample    {json} Authorization header example
 *  {
 *      "Authorization": "JWT
 *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
 *  }
 * @apiName getStores
 * @apiGroup    Store
 *
 * @apiSuccess    {Array}    stores List of Stores
 * @apiSuccess    {String}    stores.name    Unique name of the Store 
 * @apiSuccess    {String}    [stores.details] Details of the Store
 * @apiSuccess    {String}   stores.phone   Phone no of the Store 
 * @apiSuccess    {String}    [stores.email]   Valid email of the Store 
 * @apiSuccess    {String}    stores.address     Address of the Store is located
 * @apiSuccess    {String}    stores.city    City where the Store is located
 * @apiSuccess    {String}    stores.state   Standard two letter code of the state where the Store is located
 * @apiSuccess    {String}   stores.zipCode Zipcode of the location where the Store is located
 * @apiSuccess    {JSON}  stores.businessHours   Business hours of the Store
 * @apiSuccess    {JSON}  stores.businessHours.usual   The usual business hours
 * @apiSuccess    {Array}  stores.businessHours.usual.dayName    The array of days that has usual timing
 * @apiSuccess    {String}  stores.businessHours.usual.open     Time when the business hour starts (for eg 7:00 am is 700) 
 * @apiSuccess    {String}  stores.businessHours.usual.close    Time when the business hour closes (for eg 7:00 pm is 1500) 
 * @apiSuccess    {Array}  [stores.businessHours.exceptions]       Exceptions where the usual timing does not follow
 * @apiSuccess    {String}  stores.businessHours.exceptions.dayName  The days that has timing other than regular timing
 * @apiSuccess    {String}  stores.businessHours.exceptions.open    Time when the business hour starts (for eg 7:00 am is 700) 
 * @apiSuccess    {String}  stores.businessHours.exceptions.close   Time when the business hour starts (for eg 7:00 am is 700) 
 * @apiSuccess    {Array}    [stores.images]   Array of urls of images of the store 
 * @apiSuccess    {Array}    [stores.deals]    Array of ids of the deals
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "stores": [
 *              {
 *                   "name": "Olivander Wands",
 *                   "details": "Best wand in entire muggle world",
 *                   "phone": "123456",
 *                   "email": "olivander@middleEarth.shire",
 *                   "address": "221B, aker street",
 *                   "city": "New York",
 *                   "state": "NY",
 *                   "zipCode": "1234",
 *                   "businessHours": {
 *                     "usual" : {
 *                       "dayName": ["mon", "tue", "wed"],
 *                       "open": "0900",
 *                       "close": "1700"
 *                     },
 *                     "exceptions": [
 *                       {
 *                         "dayName": "sat",
 *                         "open": "1200",
 *                         "close": "1500"
 *                       }
 *                     ]
 *                   }
 *             },
 *             {
 *                   "name": "Olivander Wands",
 *                   "details": "Best wand in entire muggle world",
 *                   "phone": 123456,
 *                   "email": "olivander@middleEarth.shire",
 *                   "address": "221B, Baker street",
 *                   "city": "New York",
 *                   "state": "NY",
 *                   "zipCode": 1234,
 *                   "businessHours": {
 *                     "usual" : {
 *                       "dayName": ["mon", "tue", "wed"],
 *                       "open": "0900",
 *                       "close": "1700"
 *                     },
 *                     "exceptions": [
 *                       {
 *                         "dayName": "sat",
 *                         "open": "1200",
 *                         "close": "1500"
 *                       }
 *                     ]
 *                   }
 *             }
 *          ]
 *      }
 *      
 *
 * @apiError    ValidationError The shop is already registered
 *
 * @apiErrorExample Validation Error-Response  
 *      HTTP/1.1 400 Bad Request 
 *      {
 *          message: "name must be unique",
 *          type: "unique violation",
 *          path: "name",
 *          value: "Borgin and Burkes"
 *      }
 *
 * @apiError    AuthorizationError  The authorization token is expired or invalid
 *
 * @apiErrorExample Authorization Error-Response 
 *      HTTP/1.1 401 Unauthorized
 */

/** 
 * @api {post} /stores  Add stores to users account
 * @apiHeader {String} Authorization    Users jwt token recieved after login
 *
 * @apiHeaderExample    {json} Authorization header example
 *  {
 *      "Authorization": "JWT
 *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
 *  }
 * @apiName postStore
 * @apiGroup    Store
 *
 * @apiParam    {String}    name    Name of the Store 
 * @apiParam    {String}    [details] Details of the Store 
 * @apiParam    {String}   phone   Phone no of the Store 
 * @apiParam    {String}    [email]   Valid email of the Store 
 * @apiParam    {String}    address     Address of the Store is located
 * @apiParam    {String}    city    City where the Store is located
 * @apiParam    {String}    state   Standard two letter code of the state where the Store is located
 * @apiParam    {String}   zipCode Zipcode of the location where the Store is located
 * @apiParam    {JSON}  businessHours   Business hours of the Store
 * @apiParam    {JSON}  businessHours.usual   The usual business hours
 * @apiParam    {Array}  businessHours.usual.dayName    The array of days that has usual timing
 * @apiParam    {String}  businessHours.usual.open     Time when the business hour starts (for eg 7:00 am is 700) 
 * @apiParam    {String}  businessHours.usual.close    Time when the business hour closes (for eg 7:00 pm is 1500) 
 * @apiParam    {Array}  [businessHours.exceptions]       Exceptions where the usual timing does not follow
 * @apiParam    {String}  businessHours.exceptions.dayName  The days that has timing other than regular timing
 * @apiParam    {String}  businessHours.exceptions.open    Time when the business hour starts (for eg 7:00 am is 700) 
 * @apiParam    {String}  businessHours.exceptions.close   Time when the business hour starts (for eg 7:00 am is 700) 
 * @apiParam    {Array}    [images]   Array of urls of images of the store 
 * @apiParam    {Array}    [deals]    Array of ids of the deals
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *         "name": "Olivander Wands",
 *         "details": "Best wand in entire muggle world",
 *         "phone": "123456",
 *         "email": "olivander@middleEarth.shire",
 *         "address": "221B, Baker street",
 *         "city" : "New York",
 *         "state": "NY",
 *         "zipCode": "1234",
 *         "businessHours": {
 *           "usual" : {
 *             "dayName": ["mon", "tue", "wed"],
 *             "open": "0900",
 *             "close": "1700"
 *           },
 *           "exceptions": [
 *             {
 *               "dayName": "sat",
 *               "open": "1200",
 *               "close": "1500"
 *             }
 *           ]
 *         }
 *       }
 *
 * @apiSuccess    {String}    name    Unique name of the Store 
 * @apiSuccess    {String}    [details] Details of the Store
 * @apiSuccess    {String}   phone   Phone no of the Store 
 * @apiSuccess    {String}    [email]   Valid email of the Store 
 * @apiSuccess    {String}    address     Address of the Store is located
 * @apiSuccess    {String}    city    City where the Store is located
 * @apiSuccess    {String}    state   Standard two letter code of the state where the Store is located
 * @apiSuccess    {String}   zipCode Zipcode of the location where the Store is located
 * @apiSuccess    {JSON}  businessHours   Business hours of the Store
 * @apiSuccess    {JSON}  businessHours.usual   The usual business hours
 * @apiSuccess    {Array}  businessHours.usual.dayName    The array of days that has usual timing
 * @apiSuccess    {String}  businessHours.usual.open     Time when the business hour starts (for eg 7:00 am is 700) 
 * @apiSuccess    {String}  businessHours.usual.close    Time when the business hour closes (for eg 7:00 pm is 1500) 
 * @apiSuccess    {Array}  [businessHours.exceptions]       Exceptions where the usual timing does not follow
 * @apiSuccess    {String}  businessHours.exceptions.dayName  The days that has timing other than regular timing
 * @apiSuccess    {String}  businessHours.exceptions.open    Time when the business hour starts (for eg 7:00 am is 700) 
 * @apiSuccess    {String}  businessHours.exceptions.close   Time when the business hour starts (for eg 7:00 am is 700) 
 * @apiSuccess    {Array}    [images]   Array of urls of images of the store 
 * @apiSuccess    {Array}    [deals]    Array of ids of the deals
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *         "name": "Olivander Wands",
 *         "details": "Best wand in entire muggle world",
 *         "phone": 123456,
 *         "email": "olivander@middleEarth.shire",
 *         "address": "221B, Baker street",
 *         "city" : "New York",
 *         "state": "NY",
 *         "zipCode": 1234,
 *         "businessHours": {
 *           "usual" : {
 *             "dayName": ["mon", "tue", "wed"],
 *             "open": "0900",
 *             "close": "1700"
 *           },
 *           "exceptions": [
 *             {
 *               "dayName": "sat",
 *               "open": "1200",
 *               "close": "1500"
 *             }
 *           ]
 *         }
 *       }
 *
 * @apiError    AuthorizationError  The authorization token is expired or invalid
 *
 * @apiErrorExample Authorization Error-Response 
 *      HTTP/1.1 401 Unauthorized
 */


/**
 * @api {get} /store/:storeId   Get a store by Id
 * @apiName getStoreById
 * @apiGroup    Store
 * @apiHeader {String} Authorization    Users jwt token recieved after login
 *
 * @apiHeaderExample    {json} Authorization header example
 *  {
 *      "Authorization": "JWT
 *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
 *  }
 *
 * @apiParam    {String}    id  Unique Id of the store
 *
 * @apiSuccess    {String}    id    Unique Id of the store
 * @apiSuccess    {String}    name    Unique name of the Store 
 * @apiSuccess    {String}    [details] Details of the Store
 * @apiSuccess    {String}   phone   Phone no of the Store 
 * @apiSuccess    {String}    [email]   Valid email of the Store 
 * @apiSuccess    {String}    address     Address of the Store is located
 * @apiSuccess    {String}    city    City where the Store is located
 * @apiSuccess    {String}    state   Standard two letter code of the state where the Store is located
 * @apiSuccess    {String}   zipCode Zipcode of the location where the Store is located
 * @apiSuccess    {JSON}  businessHours   Business hours of the Store
 * @apiSuccess    {JSON}  businessHours.usual   The usual business hours
 * @apiSuccess    {Array}  businessHours.usual.dayName    The array of days that has usual timing
 * @apiSuccess    {String}  businessHours.usual.open     Time when the business hour starts (for eg 7:00 am is 700) 
 * @apiSuccess    {String}  businessHours.usual.close    Time when the business hour closes (for eg 7:00 pm is 1500) 
 * @apiSuccess    {Array}  [businessHours.exceptions]       Exceptions where the usual timing does not follow
 * @apiSuccess    {String}  businessHours.exceptions.dayName  The days that has timing other than regular timing
 * @apiSuccess    {String}  businessHours.exceptions.open    Time when the business hour starts (for eg 7:00 am is 700) 
 * @apiSuccess    {String}  businessHours.exceptions.close   Time when the business hour starts (for eg 7:00 am is 700) 
 * @apiSuccess    {Array}    [images]   Array of urls of images of the store 
 * @apiSuccess    {Array}    [deals]    Array of ids of the deals
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *         "name": "Olivander Wands",
 *         "details": "Best wand in entire muggle world",
 *         "phone": "123456",
 *         "email": "olivander@middleEarth.shire",
 *         "address": "221B, Baker Street",
 *         "city" : "New York",
 *         "state": "NY",
 *         "zipCode": "1234",
 *         "businessHours": {
 *           "usual" : {
 *             "dayName": ["mon", "tue", "wed"],
 *             "open": 0900,
 *             "close": 1700
 *           },
 *           "exceptions": [
 *             {
 *               "dayName": "sat",
 *               "open": "1200",
 *               "close": "1500"
 *             }
 *           ]
 *         }
 *       }
 *
 *      }
 *
 * @apiError  {String} Unauthorized Invalid token
 *      HTTP/1.1 401 Unauthorized
 *
 */

 /** 
  * @api {put} /store/:storeId Update a store
  * @apiName updateStoreById
  * @apiGroup    Store
  *
  * @apiHeader {String} Authorization    Users jwt token recieved after login
  *
  * @apiHeaderExample    {json} Authorization header example
  *  {
  *      "Authorization": "JWT
  *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
  *  }
  *
  * @apiParam    {String}    id     Id of the Store
  
  * @apiParamExample {json} Request-Example:
  *  {
  *    "id": 2,
  *    "name": "Noman's Goods",
  *    "details": "Quality crafts and goods",
  *    "store_type": "general",
  *    "phone": "23425235",
  *    "email": "info@normans.com",
  *  }
  
  * @apiSuccessExample Success-Response:
  *      HTTP/1.1 200 OK
  *      {

  *       }
  *
  * @apiError    AuthorizationError  The authorization token is expired or invalid
  *
  * @apiErrorExample Authorization Error-Response 
  *      HTTP/1.1 401 Unauthorized
  */

