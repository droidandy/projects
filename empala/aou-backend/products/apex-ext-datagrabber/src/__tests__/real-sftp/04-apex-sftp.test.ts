import '../../init';
import { getConnection } from 'typeorm';
import * as main from '../../main';
import * as dbServiceTest from '../lib/db-service';
import stat from '../../lib/stat';
import { logger } from '../../lib/logger';
import { instrumentsMap, prepareData } from '../lib/prepare-data';
import config from '../../lib/config';

const TIMEOUT_MILLIS = 600_000;

const expectedNodeEnv = 'test-real-sftp';
describe('Check environment variables', () => {
  test(`NODE_ENV should be "${expectedNodeEnv}"`, () => {
    expect(process.env.NODE_ENV).toEqual(expectedNodeEnv);
  });
});

describe('Testing with Apex UAT sftp server', () => {
  beforeAll(async () => {
    try {
      logger.info('Preparing initial data...');
      await prepareData();
      logger.info('Initial data prepared');
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }, TIMEOUT_MILLIS);

  afterAll(async () => {
    await getConnection('default').close();
  });

  describe('Complex test', () => {

    describe('Check mock data before test', () => {
      ['MSFT', 'GOOG', 'AAPL'].forEach(symbol => {
        test(`There should be no prices for the instrument "${symbol}" in the APEX feed`, async () => {
          const id = Number(instrumentsMap[symbol]) || 0;
          const prices = await dbServiceTest.getInstrumentStockPrices([id]);
          expect(prices?.length).toBeFalsy();
        }, TIMEOUT_MILLIS);
      });
    });

    describe('The basic procedure should work properly', () => {

      test('There should be no errors', async () => {
        config.apexExtracts.daysBeforeCurrent = 4;
        stat.reset();
        await main.loadData();
        // If the test is carried out at a time when the expected SOD file should be, but it is not yet there,
        // the corresponding entry will be in the list of errors. Let us filter it out. But besides the error
        // about the absence of a file, there should be no others.
        const errors = stat.s.errors.filter(v => !v.includes('No such file'));
        expect(errors.length).toEqual(0);
      }, TIMEOUT_MILLIS);

      test('Statistics must meet expectations', async () => {
        expect(stat.s.SODFiles.total).toBeGreaterThan(0);
        expect(stat.s.instruments.upserted).toBeGreaterThan(0);
        expect(stat.s.closingPricesSaved).toBeGreaterThan(0);
      });
    });

    describe('Data in the DB must meet expectations', () => {
      ['MSFT', 'GOOG', 'AAPL'].forEach(symbol => {
        test(`There should be prices for the instrument "${symbol}" in the APEX feed`, async () => {
          const id = Number(instrumentsMap[symbol]) || 0;
          const prices = await dbServiceTest.getInstrumentStockPrices([id]);
          expect(prices?.length).toBeGreaterThan(0);
        }, TIMEOUT_MILLIS);
      });
    });
  });
});
