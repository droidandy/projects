import { isArray, isPlainObject } from 'lodash';

/* eslint-disable */

function recursiveTransform(obj, func) {
  if (isArray(obj)) {
    return obj.map(e => recursiveTransform(e, func));
  }

  if (!isPlainObject(obj)) {
    return obj;
  }

  let result = {};

  for (const key in obj) {
    const val = obj[key];
    const tKey = func(key);

    if (isArray(val) || isPlainObject(val)) {
      result[tKey] = recursiveTransform(val, func);
    } else {
      result[tKey] = val;
    }
  }

  return result;
}

/* eslint-enable */

export function camelizeKeys(obj) {
  return recursiveTransform(obj, camelize);
}

export function snakeizeKeys(obj) {
  return recursiveTransform(obj, underscore);
}

// simplified version of camelCase that preserves dots and other characters
// (except of special chars, like '?' or '!', at the end of string)
export function camelize(string) {
  return string.replace(/\W$/, '').replace(/_(.)/g, function(_m, char) {
    return char.toUpperCase();
  });
}

// simplified version of snakeCase that doesn't treat digits as separators
function underscore(string) {
  return string.replace(/[A-Z]|\d+$/g, function(match) {
    return '_' + match.toLowerCase();
  });
}
