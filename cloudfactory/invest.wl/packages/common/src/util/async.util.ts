import { memoizeDeepResolver } from './cache.util';

export function delayPromise<T>(millis: number, value?: T): Promise<T | undefined> {
  return new Promise((resolve): void => {
    setTimeout(() => {
      resolve(value);
    }, millis);
  });
}

export interface IMemoAsyncCache<Res> {
  [args: string]: Promise<Res> | Res;
}

export function memoizeAsync(TTL = 1000) {
  const cache: IMemoAsyncCache<any> = {};

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (descriptor.value != null) {
      const originalMethod = descriptor.value as (...args: any[]) => Promise<any>;
      descriptor.value = function (...args) {
        const memoKey = memoizeDeepResolver(args);
        if (cache[memoKey]) {
          const res = cache[memoKey];
          if (res instanceof Promise) return res;
          else return Promise.resolve(res);
        }

        const promise: Promise<any> = originalMethod.apply(this, args);
        cache[memoKey] = promise;
        promise.then(res => {
          cache[memoKey] = res;
          setTimeout(() => {
            delete cache[memoKey];
          }, TTL);
          return res;
        });
        return promise;
      };
    }
    return descriptor;
  };
}
