'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Pictures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
     imageKeys: {
       type: Sequelize.JSON,
       allowNull: false
     },
     type: {
       type: Sequelize.STRING,
       allowNull: false
     },
     // entity: {
     //   type: Sequelize.ARRAY(Sequelize.TEXT)
     // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Pictures');
  }
};