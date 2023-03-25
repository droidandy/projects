
'use strict';

var models = require('./models/index');
var sequelize = models.sequelize;
var Sequelize = models.Sequelize;
var Umzug = require('umzug');
var umzug = new Umzug({
		sequelize: sequelize, 
		migrations: {
			params: [sequelize.getQueryInterface(), Sequelize],
			path: './migrations'
		}
	});
/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
// var server = app.start(app.test);

// COMMENT THIS OUT IN PRODUCTION
var server = app.start();

// UNCOMMENT THIS IN PRODUCTION TO CHECK FOR MIGRATIONS

// umzug.up().then(function(migrations) {
// 	console.log("MIGRATIONS BELOW");
// 	console.log(migrations);

// 	require('./models').sequelize.sync().then(function() {
// 		var server = app.start();
// 	});
	
// });
