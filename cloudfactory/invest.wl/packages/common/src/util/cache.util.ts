import memoize from 'lodash/memoize';

export function memoizeDeep<T extends(...args: any[]) => any>(func: T): T {
  return memoize(func, memoizeDeepResolver);
}

export function memoizeDeepResolver(...args: any[]) {
  return JSON.stringify(args);
}
