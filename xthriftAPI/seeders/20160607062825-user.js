'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {

		return queryInterface.bulkInsert('Users', [
			{ 
				firstName: 'Harry',
				lastName: 'Potter',
				email: 'hpotter@hogwarts.edu',
				username: 'lightningbolt',
				password: 'hashed',
				avatar: '',
				stores: [''],
				coordinates: JSON.stringify({}),
				zipCode: JSON.stringify({}),
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				firstName: 'Nick',
				lastName: 'Lam',
				email: 'nicholaslam.berkeley@gmail.com',
				username: 'nlam',
				password: 'hashed',
				avatar: '',
				stores: [''],
				coordinates: JSON.stringify({}),
				zipCode: JSON.stringify({}),
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				firstName: 'Hector',
				lastName: 'Felix',
				email: 'hector@xthrift.com',
				username: 'hfelix',
				password: 'hashed',
				avatar: '',
				stores: [''],
				coordinates: JSON.stringify({}),
				zipCode: JSON.stringify({}),
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				firstName: 'Remus',
				lastName: 'Lupin',
				email: 'rlupin@alumni.hogwarts.edu',
				username: 'lonewolf',
				password: 'hashed',
				avatar: '',
				stores: [''],
				coordinates: JSON.stringify({}),
				zipCode: JSON.stringify({}),
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
