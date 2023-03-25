import MockDate from 'mockdate';
import { Cache } from '../utils/cache';

describe('Cache object', () => {
  const value = BigInt(123);
  const key = '123';

  it('can create new instance', () => {
    const cache = new Cache<string, BigInt>();
    expect(cache).toBeTruthy();
  });

  it('returns null if no value by key', () => {
    const cache = new Cache<string, BigInt>();
    const val = cache.get('123');
    expect(val).toBeNull();
  });

  it('returns set value and get it back', () => {
    const cache = new Cache<string, BigInt>();
    cache.set(key, value);
    const val = cache.get(key);
    expect(val).toEqual(value);
  });

  it('returns null if date changed', () => {
    const cache = new Cache<string, BigInt>();
    cache.set(key, value);
    const val1 = cache.get(key);
    expect(val1).toEqual(value);
    MockDate.set('2021-10-10');
    const val2 = cache.get('123');
    expect(val2).toBeNull();
    MockDate.reset();
  });

  it('able to clear cache', () => {
    const cache = new Cache<string, BigInt>();
    expect(cache.size()).toEqual(0);
    cache.set(key, value);
    const val = cache.get(key);
    expect(val).toEqual(value);
    expect(cache.size()).toEqual(1);
    cache.clear();
    expect(cache.size()).toEqual(0);
  });
});
