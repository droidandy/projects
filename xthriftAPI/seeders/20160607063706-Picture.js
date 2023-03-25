'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {

		return queryInterface.bulkInsert('Pictures', [
			{ 
				imageKeys: JSON.stringify({
						thumbnail: 'thumbnail-store.png',
						main: 'main-store.png',
						download: 'download-store.png'
					}),
				type: 'store',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			

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
