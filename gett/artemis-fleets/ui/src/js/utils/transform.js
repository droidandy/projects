import { isArray, isPlainObject, camelCase, snakeCase } from 'lodash';

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
  return recursiveTransform(obj, preserveDots(camelCase));
}

export function snakeizeKeys(obj) {
  return recursiveTransform(obj, snakeCase);
}

function preserveDots(transform) {
  return function(string) {
    return string.split('.').map(transform).join('.');
  };
}
