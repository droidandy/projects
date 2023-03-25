'use strict';

exports.init = function (Sequelize) {
  return {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING
    },
    categories: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    price: {
      type: Sequelize.STRING,
      allowNull: false
    },
    specs: {
      type: Sequelize.JSON
    },
    pictures: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    condition: {
      type: Sequelize.STRING,
      allowNull: false
    }
  };
};

// seed a database
exports.sync = function (Sequelize) {
  
};
