'use strict';
/*
  this file explicits the default for configuration variables
 */

var config = {

  APP_PORT: process.env.APP_PORT || 8080,
  APP_HOST: process.env.APP_HOST || '0.0.0.0',
  SRV_NAME: process.env.SRV_NAME || 'reactweb',
  NODE_ENV: process.env.NODE_ENV || 'development',
  GOOGLEMAPS_SECRET: process.env.GOOGLEMAPS_SECRET || 'AIzaSyA-iIocu6_YpUIyVpvxCY5Q6OAOjo22PiQ',

  HOCKEY_APPID: process.env.HOCKEY_APPID || 'b46f703dfc4048fa80833b9c29445cac',
  API_HOST: process.env.API_HOST || 'local', // values for hystrix: local --> 0.0.0.0, web --> kubernetes dns names, app --> api.actionsportscommunity.com

  JWT_SECRET: process.env.JWT_SECRET || 'ASC-SECRET',
  JWT_DURATION: (process.env.JWT_DURATION || 10 * 24 * 60 * 60) * 1000 // seconds
};

if (config.NODE_ENV === 'development' || config.NODE_ENV === 'test') { // development and test specific
  config.DEBUG = process.env.DEBUG = '*'; // forcing debug output
}

exports = module.exports = config;
