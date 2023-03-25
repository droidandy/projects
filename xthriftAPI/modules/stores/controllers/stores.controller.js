'use strict';

/**
 * Module Dependencies
 */

var _ = require('lodash');
var sequelize = require('sequelize');
var Promise = require('bluebird');
var path = require('path');
var db = require('../../../models/index');
var User = db.User;
var Store = db.Store;
var userSchema = require('../models/stores.schema.js').init(sequelize);
var chalk = require('chalk');


/**
 * Add store
 */
exports.addStore = function (req, res, next) {
	console.log("Inside addStore");
  // delete role
  delete req.body.roles;

  // if (req.user.entity.indexOf('seller') === -1) {
  //   req.status(401).json({
  //     Error: "Insufficient priviledge"
  //   });
  // }

  console.log(chalk.green('profile'), req.user);

  var id = req.user.id;

  // default user for test
  if (process.env.NODE_ENV === 'test') {
    id = req.user.id || 1;
  }

  // Initialize variables
  var store = req.body;
  var message = null;

  console.log("req.body below");
  console.log(req.body);

  // Add missing fields

  // hash the password

  Store
    .build(store)
    .save()
    .then( function (store) {
      this.store = store;
      // find the user
      return User.findById(id);
    })
    .then( function (user) {
      // get the users schema value
      var value = user.dataValues;

      value.stores = value.stores || [];
      // add current store to the store
      value.stores.push(this.store.id);

      // update use document with added store
      return user.update({
        stores: value.stores
      });
    })
    .then( function (update) {
      return res.status(200).json(this.store.dataValues);
    })
    .then( null, function (err) {
      console.log(err);
      try {
        err = err.errors[0];
      } catch(e) {
        console.log(chalk.red(e));
      }
      return res.status(400).json({
        error: err
      });
    })
    .done();

  // update user
  
};

exports.list = function (req, res) {

  var query = req.query;

  // remove unwanted queries
  _.forEach(query, function (value, key) {
    console.log(chalk.green('each'), key);
    console.log(chalk.green('keyInSchema'), key in userSchema);
    if (!(key in userSchema)) {
      delete query[key];
    }
  });

  Store
    .findAll({
      where: query
    })
    .then( function (stores) {
      return res.status(200).json({stores:stores});
    })
    .then( null, function (err) {
      console.log(err);
      return res.status(400).send(err);
    })
    .done();

  // update user
};

exports.respondId = function (req, res) {
  console.log(req.store);
  res.status(200).json(req.store);
};

/**
 * Store by id
 */
exports.storeById = function (req, res, next, id) {
  console.log(chalk.green('getting store'));
  // get store by id
  Store.findOne({
    where: {
      id:id
      }
    })
    .then( function (store) {
      if (!store) {
        return next(new Error('failed to load store' + id));
      } else {
        req.store = store.dataValues;
        return next();
      }
    })
    .then(null, next)
    .done();
};


exports.updateStore = function (req, res, next) {
	console.log("inside updateStore");
	var updateValues = req.body;

	Store.findOne(
		{
			where: {
				id: req.store.id
			}
		}
	).then(function (store) {
			return store.update(updateValues);
	})
	.then( function (update) {
	  return res.status(200).json(update);
	})
	.then( null, function (err) {
	  console.log(err);
	  try {
	    err = err.errors[0];
	  } catch(e) {
	    console.log(chalk.red(e));
	  }
	  return res.status(400).json({
	    error: err
	  });
	})
	.then(null, next)
	.done();
};

exports.getStoreDeals = function (req, res, next) {

};




