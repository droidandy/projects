import { Request, Response, NextFunction, Send } from 'express';
import { Cache } from '../utils/cache';

interface ResponseCached extends Response {
  cacheJson?: Send;
}

type CacheOptions = {
  cacheKey?: string;
  updateOnRequest?: boolean;
  updateTimeout?: number;
};

const defaultOptions: CacheOptions = {
  updateOnRequest: false,
  updateTimeout: 10 * 1000,
};

const cacheLastUpdateInfo: { [key: string]: number } = {};

const CacheMiddleware = (duration: number, options?: CacheOptions) => {
  return (req: Request, res: ResponseCached, next: NextFunction) => {
    const { cacheKey, updateOnRequest, updateTimeout } = { ...defaultOptions, ...options };
    const key = cacheKey || `__express__${req.originalUrl || req.url}`;
    if (Cache.has(key)) {
      const cachedBody = Cache.get(key);

      res.json(cachedBody);

      const needUpdate = updateOnRequest && new Date().getTime() - cacheLastUpdateInfo[key] > updateTimeout!;
      if (needUpdate) {
        res.json = ((body: Object) => {
          cacheLastUpdateInfo[key] = new Date().getTime();
          Cache.set(key, body, duration);
        }) as any;

        next();
      }
    } else {
      res.cacheJson = res.json;

      res.json = (body) => {
        if (res.statusCode === 200) {
          cacheLastUpdateInfo[key] = new Date().getTime();
          Cache.set(key, body, duration);
        }
        try {
          if (res.cacheJson) {
            return res.cacheJson(body);
          }
          throw new Error('caching response error');
        } catch (e) {
          res.status(500);
          return res.send('cache error');
        }
      };

      next();
    }
  };
};

export default CacheMiddleware;
