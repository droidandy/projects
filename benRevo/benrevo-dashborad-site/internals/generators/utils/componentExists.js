/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require('fs');
const path = require('path');
const pageComponents = fs.readdirSync(path.join(__dirname, '../../../app/components'));
const pageContainers = fs.readdirSync(path.join(__dirname, '../../../app/containers'));
const pages = fs.readdirSync(path.join(__dirname, '../../../app/pages'));
const components = pageComponents.concat(pageContainers).concat(pages);

function componentExists(comp) {
  return components.indexOf(comp) >= 0;
}

module.exports = componentExists;
