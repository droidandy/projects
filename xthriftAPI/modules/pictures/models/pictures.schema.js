
'use strict';

exports.init = function (Sequelize) {
  return {
    imageKeys: {
      type: Sequelize.JSON,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    }
    // entity: {
    //   type: Sequelize.ARRAY(Sequelize.TEXT)
    // }
  };
};

// seed a database
exports.sync = function (Sequelize) {
  
};
