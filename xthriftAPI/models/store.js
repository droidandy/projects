'use strict';
module.exports = function(sequelize, DataTypes) {
  var Store = sequelize.define('Store', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    details: {
      type: DataTypes.STRING,
    },
    store_type: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zipCode: {
      type: DataTypes.INTEGER,
      // field: 'zip_code',
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
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
      type: DataTypes.JSON
    },
    businessHours: {
      type: DataTypes.JSON,
    },
    
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    deals: { // foreign key
      type: DataTypes.ARRAY(DataTypes.STRING),
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Store;
};