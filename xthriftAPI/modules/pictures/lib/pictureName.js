'use strict';

module.exports = function (name) {
  return {
    thumbnail: 'thumbnail-' + name + '.png',
    small: 'small-' + name + '.png',
    medium: 'medium-' + name + '.png',
    large: 'large-' + name + '.png'
  };
};
