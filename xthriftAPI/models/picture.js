'use strict';
module.exports = function(sequelize, DataTypes) {
  var Picture = sequelize.define('Picture', {
    imageKeys: {
      type: DataTypes.JSON,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
    // entity: {
    //   type: Sequelize.ARRAY(Sequelize.TEXT)
    // }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Picture;
};