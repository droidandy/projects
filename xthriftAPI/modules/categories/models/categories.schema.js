'use strict';

exports.init = function (Sequelize) {
  return {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // subCategory: {
    //   type: Sequelize.STRING,
    //   field: 'sub_category'
    // },

  };
};

// seed a database
exports.sync = function (Sequelize) {
};
