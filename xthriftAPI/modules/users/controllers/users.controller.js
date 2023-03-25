'use strict';

/**
 * Module dependencies
 */

var _ = require('lodash');
module.exports = _.extend(
  require('./users/users.authentication.controller.js'),
  require('./users/users.authorization.controller.js'),
  // require('./users.password.controller.js'),
  require('./users/users.profile.controller.js'),
  require('./users/users.admin.controller.js')
);

