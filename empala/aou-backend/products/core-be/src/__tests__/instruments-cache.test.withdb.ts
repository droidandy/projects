import MockDate from 'mockdate';
import connection from '../test-utils/connection';
import { gCall } from '../test-utils/gcall';
import { Instrument } from '../models/instrument';
import instrumentsCache from '../utils/instruments-cache';

describe('Instruments cache', () => {
  let instrument: Instrument;
  let appleId: BigInt;
  let appleSymbol: string;
  beforeAll(async () => {
    await connection.create();
    const instruments = await gCall({ source: createInstrumentQuery('apple') });
    instrument = instruments.data.instruments.instruments[0];
    ({ id: appleId, symbol: appleSymbol } = instrument);
  }, connection.creationTimeoutMs);
  afterAll(async () => {
    await connection.close();
  });
  beforeEach(() => jest.clearAllMocks());

  const createInstrumentQuery = (pattern: string, nMax?: number) =>
    `query Query {
      instruments(pattern: "${pattern}", nMax: ${nMax ? nMax : '2'}) {
        ... on Instruments {
          instruments {
            id
            symbol
          }
        }
      }
    }`;

  it('Can get data from DB with empty cache', async () => {
    const instId = await instrumentsCache.getInstIdBySymbol(appleSymbol);
    expect(instId).toEqual(appleId);
    const symbol = await instrumentsCache.getSymbolByInstId(appleId);
    expect(symbol).toEqual(appleSymbol);
  });

  it('Can get data from updated cache', async () => {
    instrumentsCache.set(appleId, 'SPOILED');
    let symbol = await instrumentsCache.getSymbolByInstId(appleId);
    expect(symbol).toEqual('SPOILED');

    // Set the update time to the past, thereby forcing the cache to update
    instrumentsCache.setNextReloadTime(Date.now() - 1000);

    symbol = await instrumentsCache.getSymbolByInstId(appleId);
    expect(symbol).toEqual(appleSymbol);
    const instId = await instrumentsCache.getInstIdBySymbol(appleSymbol);
    expect(instId).toEqual(appleId);
  });

  it('Can get data when date is changed', async () => {
    instrumentsCache.setNextReloadTime();
    expect(instrumentsCache.isCacheExpire()).toEqual(false);

    MockDate.set(Date.now() + instrumentsCache.ONE_DAY_MILLIS);
    expect(instrumentsCache.isCacheExpire()).toEqual(true);
    instrumentsCache.deleteByKey1(appleId);
    await instrumentsCache.getSymbolByInstId(appleId);
    MockDate.reset();

    const symbol = await instrumentsCache.getSymbolByInstId(appleId);
    expect(symbol).toEqual(appleSymbol);
    expect(instrumentsCache.isCacheExpire()).toEqual(false);
  });

  it('Can save instruments to cache using single db query', async () => {
    instrumentsCache.clear();
    expect(instrumentsCache.size).toEqual(0);
    await instrumentsCache.reloadInstrumentsCache();
    expect(instrumentsCache.size).toBeGreaterThan(0);
  });

  it('Can save instruments to cache with batching', async () => {
    instrumentsCache.clear();
    expect(instrumentsCache.size).toEqual(0);
    await instrumentsCache.reloadInstrumentsCache();
    expect(instrumentsCache.size).toBeGreaterThan(0);
  });


  it('Should load instruments from DB only once', async () => {
    instrumentsCache.clear();
    expect(instrumentsCache.size).toEqual(0);
    const spy = jest.spyOn(Instrument, 'createQueryBuilder');
    const symbols = await Promise.all([
      instrumentsCache.getSymbolByInstId(appleId),
      instrumentsCache.getSymbolByInstId(appleId),
      instrumentsCache.getSymbolByInstId(appleId),
    ]);
    symbols.forEach(symbol => {
      expect(symbol).toEqual(appleSymbol);
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Should load instruments from DB only once with Promise.race', async () => {
    instrumentsCache.clear();
    expect(instrumentsCache.size).toEqual(0);
    const spy = jest.spyOn(Instrument, 'createQueryBuilder');
    const symbol = await Promise.race([
      instrumentsCache.getSymbolByInstId(appleId),
      instrumentsCache.getSymbolByInstId(appleId),
      instrumentsCache.getSymbolByInstId(appleId),
    ]);
    expect(symbol).toEqual(appleSymbol);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Test coverage of the remaining functionality of the Bidirectional Map & instrumentsCache', async () => {
    // @ts-ignore
    instrumentsCache.errorOnExist = true;
    expect.assertions(10);
    try {
      instrumentsCache.set("1", 'QQQ');
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
    }
    expect([...instrumentsCache.entries()].length).toBeGreaterThan(0);
    expect([...instrumentsCache.keys1()].length).toBeGreaterThan(0);
    expect([...instrumentsCache.keys2()].length).toBeGreaterThan(0);
    expect(instrumentsCache.deleteByKey1("2")).toBe(true);
    expect(instrumentsCache.deleteByKey1("678903432")).toBe(false);
    expect(instrumentsCache.deleteByKey2('QQQ')).toBe(true);
    expect(instrumentsCache.deleteByKey2('there_s_no_such_thing')).toBe(false);
    expect(instrumentsCache.isEmpty).toBe(false);
    instrumentsCache.forceExpire();
    expect(instrumentsCache.getNextReloadTime()).toBe(0);
  });
});
