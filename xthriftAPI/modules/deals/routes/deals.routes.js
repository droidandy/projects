"use strict";

module.exports = function (app) {


	var router = require('express').Router();  
  // dependencies
  var controller = require("../controllers/deals.controller.js");
  var respond = require("../../core/controllers/core.controller.js").respond;
  var passport = require("passport");
  var chalk = require("chalk");

  // app.route("/deals")
  //   .get(
  //   // passport.authenticate("jwt", {session: false}), 
  //   controller.list);

    router.get('/deals', controller.getDeals);


    var storeController = require("../../stores/controllers/stores.controller.js");
	router.param("dealId", controller.dealById);
	router.param("storeId", storeController.storeById);

    // app.route("/deal/:dealId")
    // 	.get(controller.respondId)
    // 	.put(controller.updateDeal)
    // 	;

    	router.get('/deal/:dealId', controller.respondId);
    	router.put('/deal/:dealId', controller.updateDeal);

    	router.get('/store/:storeId/deals', controller.getStoreDeals);
    	router.post('/store/:storeId/deals', controller.addDeal);

  // app.route("/store/:storeId/deals")
  //   .get(
  //   // passport.authenticate("jwt", {session: false}), 
  //   controller.getStoreDeals
  //   )
  //   .post(
  //     passport.authenticate("jwt", {session: false}),
  //     controller.addDeal)
    


	return router;    

};

	

/**
 *
 * API doc
 *
 */

/**
 * @api {get} /deals Get Deals
 * @apiName    getDeals
 * @apiGroup    Deal
 *
 * @apiHeader {String} Authorization    Users jwt token recieved after login
 *
 * @apiHeaderExample    {json} Authorization header example
 *  {
 *      "Authorization": "JWT
 *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
 *  }
 *
 *
 * @apiParam    (Optional Query Parameters)	{String}    categories      Comma seperated and case sensitive. Ex: 'Men,Women'
 * @apiParam    (Optional Query Parameters)	{String}    condition       Condition of deal Ex: 'new'
 * @apiParam    (Optional Query Parameters)	{String}    keywords      Comma seperated. Not case sensitive. Ex: 'sword,wand,wood'
 *
 * @apiDescription Returns a list of deals. Can pass in optional query parameters to filter for specific deals.
 * Example: /api/v1/deals?categories=Men,Women&condition=good&keywords=sword,wand
 *
 * @apiSuccess    {Array}     data                 Response after successful add
 * @apiSuccess    {String}    data.name            Name of the Deal
 * @apiSuccess    {String}    data.description     Details of the Deal
 * @apiSuccess    {Array}     data.categories      Categories this item falls under (e.g., "Men's clothes")
 * @apiSuccess    {String}    data.condition       Condition of the item; one of ["New", "Good", "Fair", "Poor"]
 * @apiSuccess    {String}    data.price           Price of the item
 * @apiSuccess    {Array}     data.pictures        Array of urls of images of the store
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "deals": [
 *              {
 *                  "name": "Levys Blue Jeans",
 *                  "description": "Good condition; seem hardly worn.",
 *                  "categories": ["Women's clothes"],
 *                  "condition": "New",
 *                  "price": "9.99",
 *                  "specs": {
 *                    "garmentSize": {
 *                      "size": "M",
 *                      "neck": "",
 *                      "sleeve": ""
 *                    }
 *                  },
 *                  "pictures": ["1", "2"]
 *              },
 *              {
 *                  "name": "Old Navy Polo",
 *                  "description": "Blue and white striped polo.",
 *                  "categories": ["Men's clothes"],
 *                  "condition": "Good",
 *                  "price": "5.99",
 *                  "specs": {
 *                    "garmentSize": {
 *                      "size": "",
 *                      "neck": "16.5",
 *                      "sleeve": "36"
 *                    }
 *                  },
 *                  "pictures": ["3", "4"]
 *              }
 *          ]
 *      }
 *
 *
 * @apiError    AuthorizationError  The authorization token is expired or invalid
 *
 * @apiErrorExample Authorization Error-Response
 *      HTTP/1.1 401 Unauthorized
 */

/** 
 * @api {get} /deal/:dealId Get a deal by Id
 * @apiName getDealById
 * @apiGroup    Deal
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
 * @apiSuccess    {String}    id    Unique Id of the deal
 * @apiSuccess    {String}    name   Name of the deal
 * @apiSuccess    {String}    description   Description of the deal
 * @apiSuccess    {Array}    categories  Categories this deal belongs to
 * @apiSuccess    {Array}    price  Price of the deal
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "id": 2,
 *        "name": "Magical Boots",
 *        "description": "Boots crafted with magic!",
 *        "categories": ["men", "footwear"],
 *        "price": "51.50",
 *        "specs": null,
 *        "pictures": null,
 *        "condition": "new",
 *        "createdAt": "2016-05-17T14:32:06.304Z",
 *        "updatedAt": "2016-05-17T14:32:06.304Z"
 *      }
 *
 * @apiError  {String} Unauthorized Invalid token
 *      HTTP/1.1 401 Unauthorized
 
*/

/** 
 * @api {put} /deal/:dealId Update a deal
 * @apiName updateDealById
 * @apiGroup    Deal
 *
 * @apiHeader {String} Authorization    Users jwt token recieved after login
 *
 * @apiHeaderExample    {json} Authorization header example
 *  {
 *      "Authorization": "JWT
 *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
 *  }
 *
 * @apiParam    {String}    name     Name of the Deal
 
 * @apiParamExample {json} Request-Example:
 *      {
 *         "name": "Wander Thrift",
 *         "details": "Exchange old wands for new awesome ones",
 *         "images": ["1", "2"]
 *       }
 *
 * @apiSuccess    {String}    name     name of the Deal
 * @apiSuccess    {String}    [details] Details of the Deal
 * @apiSuccess    {Array}    [images]   Array of urls of images of the store 
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *         "name": "Wander Thrift",
 *         "details": "Exchange old wands for new awesome ones",
 *         "images": ["1", "2"]
 *       }
 *
 * @apiError    AuthorizationError  The authorization token is expired or invalid
 *
 * @apiErrorExample Authorization Error-Response 
 *      HTTP/1.1 401 Unauthorized
 */


/** 
 * @api {post} /store/:storeId/deals Add deal to a store
 * @apiName postStoreDeal
 * @apiGroup    Deal
 *
 * @apiHeader {String} Authorization    Users jwt token recieved after login
 *
 * @apiHeaderExample    {json} Authorization header example
 *  {
 *      "Authorization": "JWT
 *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
 *  }
 *
 * @apiParam    {String}    name            Name of the Deal
 * @apiParam    {String}    description     Details of the Deal
 * @apiParam    {Array}     categories      Categories this item falls under (e.g., "Men's clothes")
 * @apiParam    {String}    condition       Condition of the item; one of ["New", "Good", "Fair", "Poor"]
 * @apiParam    {String}    price           Price of the item
 * @apiParam    {JSON}      specs           Garment size information
 * @apiParam    {Array}     pictures        Array of urls of images of the store
 *
 * @apiParamExample {json} Request-Example:
 *  {
 *      "name": "Levys Blue Jeans",
 *      "description": "Good condition; seem hardly worn.",
 *      "categories": ["Women's clothes"],
 *      "price": "9.99",
 *      "condition": "New",
 *      "specs": {
 *        "garmentSize": {
 *          "size": "M",
 *          "neck": "",
 *          "sleeve": ""
 *        }
 *      "pictures": ["1", "2"]
 *  }
 *
 * @apiSuccess    {String}    name          Name of the Deal
 * @apiSuccess    {String}    description   Details of the Deal
 * @apiSuccess    {Array}     categories    Categories this item fall under (e.g., "men's clothes")
 * @apiSuccess    {String}    condition     Condition of the item; one of ["New", "Good", "Fair", "Poor"]
 * @apiSuccess    {String}    price         Price of the item
 * @apiSuccess    {JSON}      specs         Garment size information
 * @apiSuccess    {Array}     pictures      Array of urls of images of the store
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "name": "Levys Blue Jeans",
 *        "description": "Good condition; seem hardly worn.",
 *        "categories": ["Women's clothes"],
 *        "price": "9.99",
 *        "condition": "New",
 *        "specs": {
 *          "garmentSize": {
 *            "size": "M",
 *            "neck": "",
 *            "sleeve": ""
 *          }
 *        },
 *        "pictures": ["1", "2"]
 *      }
 *
 * @apiError    AuthorizationError  The authorization token is expired or invalid
 *
 * @apiErrorExample Authorization Error-Response
 *      HTTP/1.1 401 Unauthorized
 */

/**
 * @api {get} /store/:storeId/deals Get deals belonging to a store
 * @apiName    getStoreDeal
 * @apiGroup    Deal
 *
 * @apiHeader {String} Authorization    Users jwt token recieved after login
 *
 * @apiHeaderExample    {json} Authorization header example
 *  {
 *      "Authorization": "JWT
 *      eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1uiJ9.eyJpZCI6NjMsImZpcnN0aHJmdCIsInN1YiI6NjN9.-fEdrkQEafK6RJ25FV2o_4pst2oWxTkKivSjOFPphxQ"
 *  }
 *
 *
 * @apiSuccess    {String}    name          Name of the Deal
 * @apiSuccess    {String}    description   Details of the Deal
 * @apiSuccess    {Array}     categories    Categories this item fall under (e.g., "men's clothes")
 * @apiSuccess    {String}    condition     Condition of the item; one of ["New", "Good", "Fair", "Poor"]
 * @apiSuccess    {String}    price         Price of the item
 * @apiSuccess    {JSON}      specs         Garment size information
 * @apiSuccess    {Array}     pictures      Array of urls of images of the store
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "data": [
 *                    {
 *                      "name": "Levys Blue Jeans",
 *                      "description": "Good condition; seem hardly worn.",
 *                      "categories": ["Women's clothes"],
 *                      "price": "9.99",
 *                      "condition": "New",
 *                      "specs": {
 *                        "garmentSize": {
 *                          "size": "M",
 *                          "neck": "",
 *                          "sleeve": ""
 *                        }
 *                      },
 *                      "pictures": ["1", "2"]
 *                    },
 *                    {
 *                        "name": "Old Navy Polo",
 *                        "description": "Blue and white striped polo.",
 *                        "categories": ["Men's clothes"],
 *                        "condition": "Good",
 *                        "price": "5.99",
 *                        "specs": {
 *                          "garmentSize": {
 *                            "size": "",
 *                            "neck": "16.5",
 *                            "sleeve": "36"
 *                          }
 *                        },
 *                        "pictures": ["3", "4"]
 *                    }
 *          ]
 *      }
 *
 *
 * @apiError    AuthorizationError  The authorization token is expired or invalid
 *
 * @apiErrorExample Authorization Error-Response
 *      HTTP/1.1 401 Unauthorized
 */
