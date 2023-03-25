'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
  	firstName: {
  	  type: DataTypes.STRING,
  	  // field: 'first_name' // user attribute as firstName, whereas database field is first_name
  	},
  	lastName: {
  	  type: DataTypes.STRING,
  	  // field: 'last_name',
  	  allowNull: false
  	},
  	email: {
  	  type: DataTypes.STRING,
  	  validate: {
  	    isEmail: true,
  	  },
  	  allowNull: false
  	},
  	username: {
  	  type: DataTypes.STRING,
  	  unique: true,
  	  allowNull: false
  	},
  	password: {
  	  type: DataTypes.STRING,
  	  allowNull: false
  	},
  	avatar: {
  	  type: DataTypes.STRING,
  	},
  	stores: {
  	  type: DataTypes.ARRAY(DataTypes.TEXT)
  	},
  	coordinates: {
  	  type: DataTypes.JSON
  	},
  	zipCode: {
  	  type: DataTypes.JSON
  	}
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};