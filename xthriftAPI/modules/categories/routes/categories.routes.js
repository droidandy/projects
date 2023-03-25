"use strict";

module.exports = function (app) {
  
	var router = require('express').Router();

  // dependencies
  var controller = require("../controllers/categories.controller.js");
  var respond = require("../../core/controllers/core.controller.js").respond;
  var passport = require("passport");
  var chalk = require("chalk");

  
    // router.post(
    // '/categories', 
    // passport.authenticate("jwt", {session: false}), 
    // controller.addStore, 
    // respond 
    // )
    router.get(
    	'/categories',
      passport.authenticate("jwt", {session: false}), 
      controller.list
    );

  router.get("/category/:categoryId"
    // ,passport.authenticate("jwt", {session: false}), 
    // controller.respondId
    );

  // app.route("/s3url/:type").get( function (req, res, next) {
  //   res.send(req.params.type);
  // } );

  // app.param("categoryId", controller.categoryById);
  return router;
};

