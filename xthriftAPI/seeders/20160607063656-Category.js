'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {

		return queryInterface.bulkInsert('Categories', [
			{ 
				name: 'Men',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: 'Women',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: 'Boys',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: 'Girls',
				createdAt: new Date(), 
				updatedAt: new Date() 
			}

		], {});

	},

	down: function (queryInterface, Sequelize) {
		/*
		Add reverting commands here.
		Return a promise to correctly handle asynchronicity.

		Example:
		return queryInterface.bulkDelete('Person', null, {});
		*/
	}
};
