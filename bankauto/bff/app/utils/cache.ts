import NodeCache from 'node-cache';

export const Cache = new NodeCache({
  checkperiod: 60,
});

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

interface CacheProps {
  cacheKey?: string;
  cacheDuration?: number;
}

const UseCache = <F extends (...args: any) => Promise<any>, A extends Parameters<F>, R extends ThenArg<ReturnType<F>>>(
  key: string,
  duration: number,
  callBack: F,
): ((...args: [...A, CacheProps?]) => Promise<R>) => {
  return async (...args: [...A, CacheProps?]) => {
    // get injected props
    const lastArg = args[args.length - 1];
    const hasCacheOptions =
      !!lastArg && typeof lastArg === 'object' && ('cacheKey' in lastArg || 'cacheDuration' in lastArg);
    const cacheOptions: CacheProps | undefined = hasCacheOptions ? (args.pop() as CacheProps) : undefined;
    const cacheKey = cacheOptions?.cacheKey || key;
    const cacheDuration = cacheOptions?.cacheDuration || duration;

    // check cache and execute
    let c: R | undefined;
    if (Cache.has(cacheKey)) {
      c = Cache.get<R>(cacheKey);
      if (!c) {
        throw new Error(`Cache ${cacheKey} has not defined`);
      }
      return c;
    }

    const response: R = await callBack(args);
    Cache.set(cacheKey, response, cacheDuration);
    return response;
  };
};

export default UseCache;
