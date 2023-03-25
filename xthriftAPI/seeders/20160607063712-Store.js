'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {

		return queryInterface.bulkInsert('Stores', [
			{
			   "name":"Norman's Goods",
			   "details":"Quality crafts and supplies delivered by Norman himself!",
			   "store_type":null,
			   "phone":"000.111.5555",
			   "email":"info@normansgood.com",
			   "city":"Irvine",
			   "state":"CA",
			   "zipCode":92612,
			   "address":"20 Georgetown",
			   "coordinates":JSON.stringify({
			      "lat":33.6588951,
			      "long":-117.8282121
			   }),
			   "businessHours": JSON.stringify({
			      "usual":{
			         "dayName":[

			         ],
			         "open":"",
			         "close":""
			      },
			      "exceptions":[
			         {
			            "dayName":"sunday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"monday",
			            "open":"8AM",
			            "close":"5PM"
			         },
			         {
			            "dayName":"tuesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"wednesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"thursday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"friday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"saturday",
			            "open":"",
			            "close":""
			         }
			      ]
			   }),
			   "images":[
			      "167",
			      "168"
			   ],
			   "deals":["1"],
			   "createdAt": new Date(),
			   "updatedAt": new Date()
			},
			{
			   "name":"Milestone Twelve Store",
			   "details":"This is the best store in all of SoCal",
			   "store_type":null,
			   "phone":"0001112222",
			   "email":"mtwelve@store.com",
			   "city":"Irvine",
			   "state":"CA",
			   "zipCode":92612,
			   "address":"355 Goddard",
			   "coordinates":JSON.stringify({
			      "lat":33.6588951,
			      "long":-117.8282121
			   }),
			   "businessHours": JSON.stringify({
			      "usual":{
			         "dayName":[

			         ],
			         "open":"",
			         "close":""
			      },
			      "exceptions":[
			         {
			            "dayName":"sunday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"monday",
			            "open":"8AM",
			            "close":"5PM"
			         },
			         {
			            "dayName":"tuesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"wednesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"thursday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"friday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"saturday",
			            "open":"",
			            "close":""
			         }
			      ]
			   }),
			   "images":[
			      "150",
			      "151"
			   ],
			   "deals":["2"],
			   "createdAt": new Date(),
			   "updatedAt": new Date()
			},
			{
			   "name":"Second User's Store",
			   "details":"Authorized publisher of Watchman Nee and Witness Lee books.",
			   "store_type":null,
			   "phone":"000.111.2222",
			   "email":"second_user@store.com",
			   "city":"Anaheim",
			   "state":"CA",
			   "zipCode":92801,
			   "address":"2431 W La Palma Ave.",
			   "coordinates":JSON.stringify({
			      "lat":33.8469812,
			      "long":-117.9541894
			   }),
			   "businessHours": JSON.stringify({
			      "usual":{
			         "dayName":[

			         ],
			         "open":"",
			         "close":""
			      },
			      "exceptions":[
			         {
			            "dayName":"sunday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"monday",
			            "open":"8AM",
			            "close":"6PM"
			         },
			         {
			            "dayName":"tuesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"wednesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"thursday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"friday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"saturday",
			            "open":"",
			            "close":""
			         }
			      ]
			   }),
			   "images":[
			      "161",
			      "160"
			   ],
			   "deals":["3"],
			   "createdAt": new Date(),
			   "updatedAt": new Date()
			},
			{
			   "name":"MTwelve Two",
			   "details":"We're stingy; probably won't ever have a sale...",
			   "store_type":null,
			   "phone":"000.111.3333",
			   "email":"mtwelve_two@store.com",
			   "city":"Irvine",
			   "state":"CA",
			   "zipCode":92612,
			   "address":"80 Georgetown",
			   "coordinates":JSON.stringify({
			      "lat":33.6588951,
			      "long":-117.8282121
			   }),
			   "businessHours": JSON.stringify({
			      "usual":{
			         "dayName":[

			         ],
			         "open":"",
			         "close":""
			      },
			      "exceptions":[
			         {
			            "dayName":"sunday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"monday",
			            "open":"8AM",
			            "close":"5PM"
			         },
			         {
			            "dayName":"tuesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"wednesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"thursday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"friday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"saturday",
			            "open":"",
			            "close":""
			         }
			      ]
			   }),
			   "images":[
			      "162",
			      "163"
			   ],
			   "deals":["4"],
			   "createdAt": new Date(),
			   "updatedAt": new Date()
			},
			{
			   "name":"Thrift Supplies",
			   "details":"Sourcing the largest supplies of used goods in the area.",
			   "store_type":null,
			   "phone":"626.555.5555",
			   "email":"info@thriftsupplies.com",
			   "city":"city",
			   "state":"state",
			   "zipCode":43543,
			   "address":"address",
			   "coordinates":JSON.stringify({
			      "lat":33.589951,
			      "long":-117.8284121
			   }),
			   "businessHours": JSON.stringify({
			      "usual":{
			         "dayName":[

			         ],
			         "open":"",
			         "close":""
			      },
			      "exceptions":[
			         {
			            "dayName":"sunday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"monday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"tuesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"wednesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"thursday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"friday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"saturday",
			            "open":"",
			            "close":""
			         }
			      ]
			   }),
			   "images":[
			      "142"
			   ],
			   "deals":["5"],
			   "createdAt": new Date(),
			   "updatedAt": new Date()
			},
			{
			   "name":"Zoro Emporium",
			   "details":"Antiques and treasures",
			   "store_type":null,
			   "phone":"626.333.4444",
			   "email":"info@zoroemporium.com",
			   "city":"",
			   "state":"",
			   "zipCode":35801,
			   "address":"",
			   "coordinates":JSON.stringify({
			      "lat":34.7364493,
			      "long":-86.5501654
			   }),
			   "businessHours": JSON.stringify({
			      "usual":{
			         "dayName":[

			         ],
			         "open":"",
			         "close":""
			      },
			      "exceptions":[
			         {
			            "dayName":"sunday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"monday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"tuesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"wednesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"thursday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"friday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"saturday",
			            "open":"",
			            "close":""
			         }
			      ]
			   }),
			   "images":[
			      "145",
			      "146",
			      "148",
			      "147"
			   ],
			   "deals":["6"],
			   "createdAt": new Date(),
			   "updatedAt": new Date()
			},
			{
			   "name":"Jitters",
			   "details":"Super Cali Fragi Listic Espi Ali Docious",
			   "store_type":null,
			   "phone":"000.111.4567",
			   "email":"info@jitters.com",
			   "city":"Irvine",
			   "state":"CA",
			   "zipCode":92612,
			   "address":"0 Georgetown",
			   "coordinates":JSON.stringify({
			      "lat":33.6588951,
			      "long":-117.8282121
			   }),
			   "businessHours": JSON.stringify({
			      "usual":{
			         "dayName":[

			         ],
			         "open":"",
			         "close":""
			      },
			      "exceptions":[
			         {
			            "dayName":"sunday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"monday",
			            "open":"8AM",
			            "close":"6PM"
			         },
			         {
			            "dayName":"tuesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"wednesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"thursday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"friday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"saturday",
			            "open":"",
			            "close":""
			         }
			      ]
			   }),
			   "images":[
			      "169",
			      "170"
			   ],
			   "deals":["7"],
			   "createdAt": new Date(),
			   "updatedAt": new Date()
			},
			{
			   "name":"Recycled Goods",
			   "details":"Reuse and Recycle",
			   "store_type":null,
			   "phone":"000.222.4444",
			   "email":"info@recycledgoods.com",
			   "city":"Irvine",
			   "state":"CA",
			   "zipCode":92612,
			   "address":"40 Georgetown",
			   "coordinates":JSON.stringify({
			      "lat":33.6588951,
			      "long":-117.8282121
			   }),
			   "businessHours": JSON.stringify({
			      "usual":{
			         "dayName":[

			         ],
			         "open":"",
			         "close":""
			      },
			      "exceptions":[
			         {
			            "dayName":"sunday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"monday",
			            "open":"8AM",
			            "close":"6PM"
			         },
			         {
			            "dayName":"tuesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"wednesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"thursday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"friday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"saturday",
			            "open":"",
			            "close":""
			         }
			      ]
			   }),
			   "images":[
			      "164",
			      "165"
			   ],
			   "deals":["8"],
			   "createdAt": new Date(),
			   "updatedAt": new Date()
			},
			{
			   "name":"Kebol's Store",
			   "details":"Quality thrift items sold here",
			   "store_type":"thrift store",
			   "phone":"324232423",
			   "email":"info@kebols.com",
			   "city":"city",
			   "state":"state",
			   "zipCode":38601,
			   "address":"street address",
			   "coordinates":JSON.stringify({
			      "lat":33.6588251,
			      "long":-117.8282101
			   }),
			   "businessHours": JSON.stringify({
			      "usual":{
			         "dayName":[

			         ],
			         "open":"",
			         "close":""
			      },
			      "exceptions":[
			         {
			            "dayName":"sunday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"monday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"tuesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"wednesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"thursday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"friday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"saturday",
			            "open":"",
			            "close":""
			         }
			      ]
			   }),
			   "images":[
			      "124",
			      "125",
			      "126",
			      "127",
			      "128",
			      "129"
			   ],
			   "deals":["9"],
			   "createdAt": new Date(),
			   "updatedAt": new Date()
			},
			{
			   "name":"Eureka! Store",
			   "details":"Start, continue, and end a conversation; listen more effectively; Enjoy yourself in the process.",
			   "store_type":null,
			   "phone":"757.234.2347",
			   "email":"eureka@store.com",
			   "city":"Irvine",
			   "state":"CA",
			   "zipCode":92612,
			   "address":"400 Georgetown",
			   "coordinates":JSON.stringify({
			      "lat":33.6588951,
			      "long":-117.8282121
			   }),
			   "businessHours": JSON.stringify({
			      "usual":{
			         "dayName":[

			         ],
			         "open":"",
			         "close":""
			      },
			      "exceptions":[
			         {
			            "dayName":"sunday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"monday",
			            "open":"6AM",
			            "close":"3PM"
			         },
			         {
			            "dayName":"tuesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"wednesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"thursday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"friday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"saturday",
			            "open":"",
			            "close":""
			         }
			      ]
			   }),
			   "images":[
			      "188",
			      "189"
			   ],
			   "deals":["10"],
			   "createdAt": new Date(),
			   "updatedAt": new Date()
			},
			{
			   "name":"Simon's Wands Emporium",
			   "details":"The best quality wands in Socal!",
			   "store_type":"Wands",
			   "phone":"(111) 222-3333",
			   "email":"store@store.com",
			   "city":"Tuscan",
			   "state":"CA",
			   "zipCode":92618,
			   "address":"355 Goddard",
			   "coordinates":JSON.stringify({
			      "lat":55.02,
			      "long":-1.42
			   }),
			   "businessHours": JSON.stringify({
			      "usual":{
			         "dayName":[

			         ],
			         "open":"",
			         "close":""
			      },
			      "exceptions":[
			         {
			            "dayName":"sunday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"monday",
			            "open":"8AM",
			            "close":""
			         },
			         {
			            "dayName":"tuesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"wednesday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"thursday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"friday",
			            "open":"",
			            "close":""
			         },
			         {
			            "dayName":"saturday",
			            "open":"",
			            "close":""
			         }
			      ]
			   }),
			   "images":[
			      "155",
			      "156"
			   ],
			   "deals":["11"],
			   "createdAt": new Date(),
			   "updatedAt": new Date()
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
