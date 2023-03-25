/**
 * Created by developercomputer on 04.12.15.
 */
module.exports = () => {
  if(!window.Promise) {
    window.Promise = require("es6-promise-polyfill").Promise;
  }
};