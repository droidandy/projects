import '../../init/init';
import { getConnection, QueryRunner } from 'typeorm';
import dayjs, { Dayjs } from 'dayjs';
import config from 'config';
import * as dbService from '../../db-service';
import { getLastPriceDates, queryCore } from '../../db-service';
import { main } from '../../main';
import { getSymbolNameChanges } from '../../symbol-name-changes';
import { CreateInstrumentInput, EFeed, EInstrumentType, ECountry } from '../../types/gql-types';
import { TESTING_MODE } from '../../constants';
import { requestMorningStar } from '../../morningstar-api';
import { EMSAPIEndpoint } from '../../morningstar-enums';
import { logger } from '../../lib/logger';
import { connect, instrumentsMap, prepareData, refreshInstrumentsMap } from './prepare-data';
import { isIP, myIP } from '../../lib/my-ip';

const TIMEOUT_MILLIS = 30_000;
const MICROSERVICE_WORK_TIMEOUT_MILLIS = 300_000;
const CURRENT_DAY = dayjs();

const isInstrumentPresent = async (symbol: string): Promise<boolean> => {
  const result = await queryCore(
    `query mq($symbols: [String!]) {
          inst: instrumentsInfo(symbols: $symbols) {
            ... on Instruments {
              instruments {
                id
              }
            }
          }
        }`,
    { symbols: [symbol] }
  );
  return result.inst.instruments.length > 0;
};

const getLastPriceDateForSymbol = async (symbol: string): Promise<Dayjs | null> => {
  const id = instrumentsMap[symbol];
  if (!id) {
    return null;
  }
  const rows = await getLastPriceDates([id], EFeed.MORNING_STAR);
  const ts = rows?.[0]?.lastPriceDate;
  return ts ? dayjs(ts) : null;
};


describe('Check environment variables', () => {
  test('It should be testing mode', () => {
    expect(TESTING_MODE).toBe(true);
  });
  test('The values of some ENV must be', () => {
    expect(!!process.env.HASURA_GRAPHQL_ADMIN_SECRET).toBe(true);
  });
});

describe('Check connection to MorningStar', () => {

  test('The Public IP address used must be whitelisted', async () => {
    let IPWhitelist: string | string[] = config.get('morningStar.IPWhitelist');
    if (typeof IPWhitelist === 'string') {
      IPWhitelist = IPWhitelist.split(/[, ]+/).map(v => v.trim()).filter(isIP);
    }
    expect(IPWhitelist.length).toBeGreaterThan(0);
    const ourIP = await myIP(TIMEOUT_MILLIS);

    logger.info(`Our public IP is ${ourIP}`);
    logger.info(`MorningStar host: ${config.get('morningStar.host')}`);

    expect(IPWhitelist.includes(ourIP)).toBe(true);
  }, TIMEOUT_MILLIS);

  test('There should be an HTTP response from the MorningStar server', async () => {
    let res;
    try {
      res = await requestMorningStar(EMSAPIEndpoint.INDEX_PHP, 'fields=H1');
    } catch (err) {
      logger.error(err);
    }
    expect(Array.isArray(res?.results)).toBe(true);
  }, TIMEOUT_MILLIS);
});

let queryRunner: QueryRunner;

describe('MorningStar microservice should work properly', () => {

  beforeAll(async () => {
    try {
      await connect();
      queryRunner = await prepareData();
    } catch (e) {
      logger.error(e);
    }
  }, TIMEOUT_MILLIS);

  afterAll(async () => {
    await getConnection('default').close();
  });

  describe('Methods of interaction with DB should work properly', () => {
    test('Instruments should not be duplicated when upserted', async () => {
      const SHORT_DESCRIPTION = 'double of LI'; // LI : id = 1980
      const packet: CreateInstrumentInput[] = [
        {
          symbol: 'LI',
          cusip: null,
          sedol: null,
          exchangeName: 'NMS',
          type: EInstrumentType.STOCK,
          description: 'li auto inc',
          shortDescription: SHORT_DESCRIPTION,
          country: ECountry.USA
        }
      ];
      await dbService.saveMissingInstruments(packet, EFeed.MORNING_STAR, null);
      const [{ count }] = await queryRunner.query('SELECT COUNT(*) from instruments.inst WHERE symbol = \'LI\'');
      if (count > 1) {
        await queryRunner.query(`
          DELETE
          FROM instruments.inst_feed
          WHERE inst_id IN (
            SELECT id
            from instruments.inst
            where shortdescription = '${SHORT_DESCRIPTION}'
          );
          DELETE
          FROM instruments.inst
          WHERE shortdescription = '${SHORT_DESCRIPTION}';
        `);
      }
      expect(Number(count)).toEqual(1);
    }, TIMEOUT_MILLIS);
  });

  describe('Check mock data before test', () => {
    ['AAPL', 'SPY'].forEach(symbol => {
      test(`"${symbol}" must be absent in the instruments.inst table`, async () => {
        const isPresent = await isInstrumentPresent(symbol);
        expect(isPresent).toBe(false);
      }, TIMEOUT_MILLIS);
    });

    test('Daily Prices for "GOOG" must be absent', async () => {
      const lastPriceDate = await getLastPriceDateForSymbol('GOOG');
      expect(lastPriceDate).toBe(null);
    }, TIMEOUT_MILLIS);

    ['MSFT', 'QQQ'].forEach(symbol => {
      test(`Latest prices for "${symbol}" must be 16-13 days prior to today`, async () => {
        const lastPriceDate = await getLastPriceDateForSymbol(symbol);
        expect(lastPriceDate && lastPriceDate.isAfter(CURRENT_DAY.subtract(16, 'days'))).toBe(true);
        expect(lastPriceDate && lastPriceDate.isBefore(CURRENT_DAY.subtract(13, 'days'))).toBe(true);
      }, TIMEOUT_MILLIS);
    });
  });

  test('Microservice should receive data about name changes of instruments from MorningStar', async () => {
    let symbolNameChanges: any[];
    try {
      symbolNameChanges = await getSymbolNameChanges();
    } catch (e) {
      logger.error(e);
    }
    expect(symbolNameChanges.length).toBeGreaterThan(100);
    expect(symbolNameChanges[0].oldSymbol).toBeTruthy();
  }, MICROSERVICE_WORK_TIMEOUT_MILLIS);

  test('Microservice should receive data from MorningStar and finish correctly', async () => {
    let completeState: number = -3;
    try {
      completeState = await main();
    } catch (e) {
      logger.error(e);
    }
    expect(completeState).toBe(1);
  }, MICROSERVICE_WORK_TIMEOUT_MILLIS);

  describe('The result of the microservice should meet expectations', () => {

    beforeAll(async () => {
      try {
        await refreshInstrumentsMap();
      } catch (e) {
        logger.error(e);
      }
    }, TIMEOUT_MILLIS);

    ['AAPL', 'SPY'].forEach(symbol => {
      test(`"${symbol}" must be present in the instruments.inst table`, async () => {
        const isPresent = await isInstrumentPresent(symbol);
        expect(isPresent).toBe(true);
      }, TIMEOUT_MILLIS);
    });

    ['MSFT', 'QQQ', 'GOOG', 'AAPL', 'SPY'].forEach(symbol => {
      test(`Latest prices for "${symbol}" must be no older than 7 days`, async () => {
        const lastPriceDate = await getLastPriceDateForSymbol(symbol);
        logger.info(`Last Price Date for "${symbol}" is ${lastPriceDate && lastPriceDate.format('YYYY-MM-DD')}`);
        expect(lastPriceDate && lastPriceDate.isAfter(CURRENT_DAY.subtract(7, 'days'))).toBe(true);
      }, TIMEOUT_MILLIS);
    });
  });
});


