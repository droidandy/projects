'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {

		return queryInterface.bulkInsert('Deals', [
			{ 
				name: 'Invisibility Cloak',
				description: 'A very rare and expensive cloak made from pelts of Demiguise. Makes the wearer invisible.',
				categories: ['Men', 'Women', 'Boys', 'Girls'],
				price: '26.50',
				specs: JSON.stringify({"garmentSize":{"neck":"","size":"m","sleeve":""}}),
				pictures: [''],
				condition: 'good',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: 'Remembrall',
				description: 'A small, clear orb, about the size of a tennis ball, containing smoke that turns red when it detects that the person holding it has forgotten something.',
				categories: ['Men', 'Women', 'Boys', 'Girls'],
				price: '13.85',
				pictures: [''],
				condition: 'new',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: 'Gobstones',
				description: "One of the many magical games played by young wizards in the books, along with Wizard's Chess and Exploding Snap.",
				categories: ['Men', 'Women', 'Boys', 'Girls'],
				price: '42.30',
				pictures: [''],
				condition: 'new',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: "Tom Riddle's Diary",
				description: "Tom Riddle's diary, which he used to create his second Horcrux during his sixth year at Hogwarts",
				categories: ['Men', 'Women', 'Boys', 'Girls'],				
				price: '63.75',
				pictures: [''],
				condition: 'poor',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: "Goblet of Fire",
				description: "The Goblet of Fire is a goblet made of wood and is used at the beginning of every Triwizard Tournament.",
				categories: ['Men', 'Women', 'Boys', 'Girls'],				
				price: '86.95',
				pictures: [''],
				condition: 'good',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: "Godric Gryffindor's Sword",
				description: "The Sword of Godric Gryffindor is a goblin-made sword adorned with large rubies on the pommel. It was once owned by Godric Gryffindor, one of the medieval founders of Hogwarts.",
				categories: ['Men', 'Women', 'Boys', 'Girls'],				
				price: '200.00',
				pictures: [''],
				condition: 'good',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: "Resurrection Stone",
				description: "The Resurrection Stone allows the holder to bring back deceased loved ones, in a semi-physical form, and communicate with them.",
				categories: ['Men', 'Women', 'Boys', 'Girls'],				
				price: '650.00',
				pictures: [''],
				condition: 'new',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: "The Marauder's Map",
				description: "The Marauder's Map is a magical map of Hogwarts created by Remus Lupin, Peter Pettigrew, Sirius Black, and James Potter.",
				categories: ['Men', 'Women', 'Boys', 'Girls'],				
				price: '7.65',
				pictures: [''],
				condition: 'poor',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: "Elder Wand",
				description: "The Elder Wand, known throughout history as the Deathstick or the Wand of Destiny,[HP7] is an extremely powerful wand made of elder wood with a core of Thestral tail hair.",
				categories: ['Men', 'Women', 'Boys', 'Girls'],				
				price: '95.99',
				pictures: [''],
				condition: 'good',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: "Foe-glass",
				description: "A Foe-glass is a mirror that detects and shows its owner's enemies in or out of focus, depending on how close they are.",
				categories: ['Men', 'Women', 'Boys', 'Girls'],				
				price: '22.77',
				pictures: [''],
				condition: 'good',
				createdAt: new Date(), 
				updatedAt: new Date() 
			},
			{ 
				name: "Revealer",
				description: "A Revealer is a bright red eraser, used to make invisible ink appear.",
				categories: ['Men', 'Women', 'Boys', 'Girls'],				
				price: '3.65',
				pictures: [''],
				condition: 'new',
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
