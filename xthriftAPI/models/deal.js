'use strict';
module.exports = function(sequelize, DataTypes) {
  var Deal = sequelize.define('Deal', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    categories: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specs: {
      type: DataTypes.JSON
    },
    pictures: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Deal;
};