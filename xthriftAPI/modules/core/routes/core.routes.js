'use strict';

module.exports = function (app) {

	var router = require('express').Router();

  var core = require('../controllers/core.controller.js');

  // Respond with error messages
  // app.route('/server-error').get(core.respondServerError);
  router.get('/server-error', core.respondServerError);

  // return 404 for all undefined api
  // app.route('/:url(api|modules|lib)/*')
  //   .get(core.respondNotFound);
  router.get('/:url(api|modules|lib)/*', core.respondNotFound);

	return router;  
};
