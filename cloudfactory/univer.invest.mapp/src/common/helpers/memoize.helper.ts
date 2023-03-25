import memoize from 'lodash/memoize';

export function argsDeepEqualsMemoize<T extends(...args: any[]) => any>(func: T): T {
  return memoize(func, resolverJsonStringify);
}

function resolverJsonStringify(...args: any[]) {
  return JSON.stringify(args);
}
