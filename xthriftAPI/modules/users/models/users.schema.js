'use strict';

exports.init = function (Sequelize) {
  return {
    firstName: {
      type: Sequelize.STRING,
      field: 'first_name' // user attribute as firstName, whereas database field is first_name
    },
    lastName: {
      type: Sequelize.STRING,
      field: 'last_name',
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    zipCode: {
      type: Sequelize.JSON
    },
    coordinates: {
      type: Sequelize.JSON
    },
    avatar: {
      type: Sequelize.STRING,
    },
    stores: {
      type: Sequelize.ARRAY(Sequelize.TEXT)
    }
  };
};

// seed a database
exports.sync = function (Model) {
  Model.sync();
};
