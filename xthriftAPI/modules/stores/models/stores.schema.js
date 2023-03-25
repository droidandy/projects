'use strict';

exports.init = function (Sequelize) {
  return {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    details: {
      type: Sequelize.STRING,
    },
    store_type: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      }
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false
    },
    zipCode: {
      type: Sequelize.INTEGER,
      field: 'zip_code',
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },

    /**
     * Format for business hours
     */
    // {
    //   usual: {
    //     dayName: [mon, tue, wed, thur, fri],
    //     time: {
    //       open: hourInInternationalFormat,
    //       close: hourInInternationalFormat,
    //     }
    //   },
    //   exceptions:[
    //   {
    //      dayName: "Saturday",
    //      open: hourInInternationalFormat,
    //      close: hourInInternationalFormat,
    //     },
    //   {
    //      dayName: "Saturday",
    //      open: hourInInternationalFormat,
    //      close: hourInInternationalFormat,
    //     }
    //   ]
    // }

    coordinates: {
      type: Sequelize.JSON
    },
    businessHours: {
      type: Sequelize.JSON,
      field: 'business_hours'
    },
    
    images: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    deals: { // foreign key
      type: Sequelize.ARRAY(Sequelize.STRING),
    }
  };
};

// seed a database
exports.sync = function (Sequelize) {
  
};
