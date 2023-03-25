'use strict';

/**
* Module dependencies
*/

var _ = require('lodash');
var chalk = require('chalk');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

/**
 * Get files by glob patterns
 */
var getGlobbedPaths = function (globPatterns, excludes) {
  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  //The output array
  var output = [];

  // If glob pattern is array, then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
    var files = glob.sync(globPatterns);
    if (excludes) {
      files = files.map(function (file) {
        if (_.isArray(excludes)) {
          for (var i in excludes) {
            file = file.replace(excludes[i], '');
          }
        } else {
          file = file.replace(excludes, '');
        }
        return file;
      });
    }
    output = _.union(output, files);
    }
  }

  return output;
};

/**
 * Validate NODE_ENV existence
 */
var validateEnvironmentVariable = function () {

	process.env.NODE_ENV = 'development';
	
  var environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
  console.log();
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment, using development instead'));
    } else {
      console.error(chalk.red('+Error: NODE_ENV is not defined! Using default development environment'));
      process.env.NODE_ENV = 'development';
    }
  } 
  console.log(chalk.white(''));
};

/**
 * Initialize global configuration files
 */
var initGlobalConfigFiles = function (config, assets) {
  // Append files
  config.files = {};

  // Setting Globbed model files
  config.files.models = getGlobbedPaths(assets.models);

  // Setting Globbed route files
  config.files.routes = getGlobbedPaths(assets.routes);

  // Setting Globbed config files
  config.files.configs = getGlobbedPaths(assets.config);

  // Setting Globbed test files
  config.files.tests = getGlobbedPaths(assets.test);
};

/**
 * Initialize global configuration
 */

var initGlobalConfig = function () {

  // Validate NODE_ENV existenceo
  validateEnvironmentVariable();

  // Get the default assets
  var defaultAssets = require(path.join(process.cwd(), 'config/assets/default'));

  //Get the current assets
  var environmentAssets = require(path.join(process.cwd(), 'config/assets/', process.env.NODE_ENV)) || {};

  //Merge assets
  var assets = _.merge(defaultAssets, environmentAssets);


  // Get the default config
  var defaultConfig = require(path.join(process.cwd(), 'config/env/default'));

  // Get the current config
  var environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};

  // Merge config files
  var config = _.merge(defaultConfig, environmentConfig);

  //read package.json for project information
  var pkg = require(path.resolve('./package.json'));
  config.xthrift = pkg;

  // config object is extended with the local.js custom/local environment only if we are on production or development. 
  // while we are on test environment, we dont.
  if (process.env.NODE_ENV !== 'test') {
    config = _.merge(config, (fs.existsSync(path.join(process.cwd(), 'config/env/local.js')) && require(path.join(process.cwd(), 'config/env/local.js'))) || {});
  }

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths,
  };

  return config;
};

/**
 * Set configuration object
 */

module.exports = initGlobalConfig();
