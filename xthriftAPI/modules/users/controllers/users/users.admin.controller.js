var sequelize = require('sequelize');

var _ = require('lodash');

var chalk = require('chalk');
var db = require('../../../../models/index');
var User = db.User;
var userSchema = require('../../models/users.schema').init(sequelize);

// Admin functions
exports.list = function(req, res) {

	User
	  .findAll()
	  .then( function (users) {
	    return res.status(200).json({users:users});
	  })
	  .then( null, function (err) {
	    console.log(err);
	    return res.status(400).send(err);
	  })
	  .done();

	// update user
};


exports.deleteUser = function(req, res, next) {

	User.findOne(
		{
			where: {
				id: req.profile.id
			}
		}
	).then(function (user) {
		return user.destroy();
	})
	.then(function (destroy) {
		return res.status(200).json(destroy);
	})
	.then(null, function (err) {
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






