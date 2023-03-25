
'use strict';

/**
 * Module Dependencies
 */

var _ = require('lodash');
var sequelize = require('sequelize');
var Promise = require('bluebird');
var path = require('path');
var db = require('../../../models/index');
var Deal = db.Deal;
var Store = db.Store;
var chalk = require('chalk');

/**
 * Add Deal
 */
exports.addDeal = function (req, res, next) {
  // delete role
  delete req.body.roles;

  // if (req.user.entity.indexOf('seller') === -1 && req.user.stores.indexOf(req.params.storeId)) {
  //   req.status(401).json({
  //     Error: "Insufficient priviledge"
  //   });
  // }

  var id = req.params.storeId;

  // Initialize variables
  var deal = req.body;
  req.body.storeId = id;
  var message = null;

  // Add missing fields

  // hash the password

  Deal
    .build(deal)
    .save()
    .then( function (deal) {
      console.log(chalk.green('deal'), deal.dataValues);
      this.deal= deal;
      // find the user
      return Store.findById(id);
    })
    .then( function (store) {
      console.log(chalk.green('store'), store.dataValues);
      if (!store) {
        throw new Error('store not found');
      }
      // get the store schema value
      var value = store.dataValues;

      value.deals= value.deals || [];
      // add current dealid to the store's deal
      value.deals.push(this.deal.id);

      // update use document with added store
      return store.update({
        deals: value.deals
      });
    })
    .then( function (update) {
      console.log(chalk.green('update:'), update.dataValues);
      return res.status(200).json(this.deal.dataValues);
    })
    .catch( function (err) {
      console.log(err);
      return res.status(400).json({
        error: err
      });
    })
    // .then( null, function (err) {
    //   console.log(err);
    //   return res.status(400).json({
    //     error: err
    //   });
    // })
    .done();
};


exports.getDeals = function (req, res) {
	var query = {};
	
	if (req.query.categories) {
		var queryCategories = req.query.categories.split(',');
		console.log("queryCategories: ", queryCategories);
		if (queryCategories.length > 0) {
			query.categories = {
				$contains: queryCategories
			};
		}
	}

	if (req.query.condition) {
		var queryCondition = req.query.condition;
		console.log("queryCondition: ", queryCondition);
		if (queryCondition) {
			query.condition = queryCondition;
		}
	}

	if (req.query.keywords) {
		var queryKeywords = req.query.keywords.split(',');
		for (var i = 0; i < queryKeywords.length; i++) {
			queryKeywords[i] = '%' + queryKeywords[i] + '%';
		}
		console.log("queryKeywords: ", queryKeywords);
		if (queryKeywords.length > 0) {
			query.$or = [
				{
					name: {
						$iLike: {
							$any: queryKeywords	
						}
					}
				},
				{
					description: {
						$iLike: {
							$any: queryKeywords	
						}
					}
				},
			];
		}
	}
	
	console.log("queryObject: ", query);

	Deal.findAll({
		where: query
	})
	.then(function(deals) {
		return res.json({deals:deals});
	})
	.then(null, function(err) {
		console.log(err);
		return res.status(400).send(err);
	})
	.done();
};

/**
 * List deals
 */

exports.list = function (req, res) {
  
  var params = req.params;
  
  Deal
    .findAll()
    .then( function (deals) {
      return res.json({deals: deals});
    })
    .then( null, function (err) {
      console.log(err);
      return res.status(400).send(err);
    })
    .done();

  // update user
};

exports.respondId = function (req, res) {
  res.status(200).json(req.deal);
};

/**
 * Deal by id
 */
exports.dealById = function (req, res, next, id) {

  Deal.findOne({where: {id:id}})
    .then( function (deal) {
      if (!deal) {
        return next(new Error('failed to load deal' + id));
      } else {
        req.deal = deal.dataValues;
        return next();
      }
    })
    .then(null, next)
    .done();
};

exports.updateDeal = function (req, res, next) {
	console.log("inside updateDeal");
	var updateValues = req.body;

	Deal.findOne(
		{
			where: {
				id: req.deal.id
			}
		}
	).then(function (deal) {
			return deal.update(updateValues);
	})
	.then( function (update) {
	  return res.status(200).json(update);
	}, function(err) {
		console.log("error in update: ", err);
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

/**
 * Deal by Store Id
 */
exports.getStoreDeals = function (req, res, next) {
  console.log(req.store);
  var orObj = [];

  req.store.deals.forEach( function (dealId) {
    orObj.push({id: dealId});
  });
  
  Deal.findAll({
    where: {
      $or: orObj
    }
  })
  .then( function (deal) {
    console.log(deal);
    return res.status(200).json({data: deal});
  })
  .then( null, function (err) {
    return res.status(400).json(new Error('db error'));
  });
};

