import '../../init';
import MockDate from 'mockdate';
import { getConnection } from 'typeorm';
import { DateTime } from 'luxon';
import * as sftp from '../../lib/sftp';
import { CreateInstrumentInput, ECountry, EInstrumentType } from '../../types/gql-types';
import * as utils from '../../lib/utils';
import { putFile } from '../lib/put-file-by-sftp';
import { logger } from '../../lib/logger';
import * as parser from '../../lib/parser';
import { deleteLocalFile } from '../lib/tools';
import { prepareData } from '../lib/prepare-data';
import * as dbServiceTest from '../lib/db-service';
import * as main from '../../main';
import stat from '../../lib/stat';
import config from '../../lib/config';

const TIMEOUT_MILLIS = 180_000;

const getMockFileContent = (instrument: any, reportDate: ISODateString): string => {
  const { cusip, symbol, type, shortDescription, description } = instrument;
  return `${cusip}|${symbol}|${shortDescription}|${type === EInstrumentType.STOCK ? 'A' : 'C'}|0|2|Y|Y||||Y|1|||||||||` +
    `||||||||1|0.0000000000|65.4000000000|||${description}|||09/04/2015|09/04/2015|${utils.ISO2MDY(reportDate)}|9999` +
    '|0.00|0.00|0|0|US|N|A017748||1.0000|||||||||||||0.0000000000||09/21/2015\n';
};

const testInstruments: CreateInstrumentInput[] = [
  {
    exchangeName: 'NYSE',
    symbol: 'A199999',
    country: ECountry.USA,
    cusip: '000303107',
    type: EInstrumentType.STOCK,
    shortDescription: 'Test INC CO',
    description: 'Test INC CO'
  },
  {
    exchangeName: 'NYSE',
    symbol: 'A1999',
    country: ECountry.USA,
    cusip: '000304105',
    type: EInstrumentType.STOCK,
    shortDescription: 'Test TECHNOLOGIES H',
    description: 'Test TECHNOLOGIES H'
  },
  {
    exchangeName: 'NYSE',
    symbol: 'LI',
    country: ECountry.USA,
    cusip: '50202M102',
    type: EInstrumentType.ETF,
    shortDescription: 'LI NEW SHORT DESCR',
    description: 'LI NEW DESCR'
  },
  {
    exchangeName: 'NYSE',
    symbol: 'PLUG',
    country: ECountry.USA,
    cusip: '72919P202',
    type: EInstrumentType.ETF,
    shortDescription: 'PLUG NEW SHORT DESCR',
    description: 'PLUG NEW DESCR'
  }
];

/*
# Testing workflow.

We form a test file for 2021-11-25: EXT747_MPLA_20211125.txt, which contains:
- Existing instrument 'LI' (DB data for it: feed [APEX, MORNING_STAR]. No prices.)
- Existing instrument 'PLUG' (DB data for it: feed [MORNING_STAR]. No prices.)
- 2 non-existent instruments 'A1999', 'A199999'

Upload the file to the local SFTP server.

Testing the operation of downloading a file from an SFTP server
Testing parsing of the EXT747 file
We conduct a comprehensive test, during which we expect:
- Updating data for existing instruments (LI, PLUG) (type, description, shortdescription, feeds)
- Appearance of new instruments (A1999, A199999).
- Appearance of prices for them
*/

describe.only('Testing the functionality of the microservice in conjunction with a test SFTP server', () => {
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

  describe('Test download over SFTP & parsing', () => {
    test('sftp.getRemoteFilePath() should returns correct path', () => {
      const result = sftp.getRemoteFilePath('2020-01-01');
      expect(result).toEqual('/download/20200101/EXT747/EXT747_MPLA_20200101.txt');
    });

    {
      const reportDate: ISODateString = '2021-11-24';
      let localFilePath: string;
      test('Downloading a file over SFTP', async () => {

        const remoteFilePath = sftp.getRemoteFilePath(reportDate);
        const fileContent = testInstruments.map(instrument => getMockFileContent(instrument, reportDate)).join('');
        logger.info(`Uploading mock file to local SFTP server to ${remoteFilePath} ...`);
        const isUploaded = await putFile(fileContent, remoteFilePath);
        expect(isUploaded).toBe(true);

        // Downloading mock file from local SFTP server
        localFilePath = await sftp.downloadSODFile(reportDate);
        expect(localFilePath).toEqual(sftp.getSODFileName(reportDate));
      });

      test('Parsing of EXT747 report', async () => {
        logger.info(`Parsing local mock file ${localFilePath} ...`);
        const parseResult = await parser.parseEXT747(localFilePath, reportDate);
        expect(parseResult).toBeTruthy();

        const { instruments, closePriceBySymbolMap } = parseResult;
        instruments.forEach((instrument: any, index) => {

          expect(instrument).toMatchObject(testInstruments[index]);
          const closePrice = parseFloat(closePriceBySymbolMap[instrument.symbol]);
          expect(closePrice).toBeCloseTo(65.4);

        });
        logger.info(`Remove local mock file ${localFilePath}`);
        deleteLocalFile(localFilePath);
      });

      test('An error should be thrown if there is no file to parse', async () => {
        try {
          await parser.parseEXT747(localFilePath, reportDate);
          expect(true).toBe(false);
        } catch (err: any) {
          expect(err.message).toMatch(/Local file .+ is missing/);
          expect(err.severity).toEqual(1);
        }
      });
    }
  });

  describe('Complex test', () => {

    describe('Check mock data before test', () => {
      ['A1999', 'A199999'].forEach(symbol => {
        test(`"${symbol}" must be absent in the instruments.inst table`, async () => {
          const isPresent = await dbServiceTest.isInstrumentPresent(symbol);
          expect(isPresent).toBe(false);
        }, TIMEOUT_MILLIS);
      });

      [
        {
          type: 'STOCK',
          symbol: 'LI',
          cusip: '50202M102',
          description: 'LI AUTO INC',
          shortDescription: 'LI AUTO INC',
          feeds: ['APEX', 'MORNING_STAR']
        },
        {
          type: 'STOCK',
          symbol: 'PLUG',
          cusip: '72919P202',
          description: 'PLUG POWER INC',
          shortDescription: 'PLUG POWER INC',
          feeds: ['MORNING_STAR']
        }
      ].forEach(expected => {
        const { symbol } = expected;
        test(`Data for the instrument "${symbol}" must be in the initial state`, async () => {
          const inst = await dbServiceTest.getInstrumentBySymbol(symbol);
          expect(inst).toMatchObject(expected);
          const stockPrices = await dbServiceTest.getInstrumentStockPrices([inst.id]);
          expect(stockPrices.length).toEqual(0);
        }, TIMEOUT_MILLIS);
      });
    });

    describe('The basic procedure should work properly', () => {

      test('There should be no errors', async () => {
        stat.reset();
        MockDate.set(DateTime.fromISO('2021-11-25T10:00:00.000-06:00').toJSDate());
        await main.loadData();
        MockDate.reset();
        expect(stat.s.errors.length).toEqual(0);
      }, TIMEOUT_MILLIS);

      test('Statistics must meet expectations', async () => {
        expect(stat.s.expectedReportDate).toEqual('2021-11-24');
        expect(stat.s.SODFiles.total).toEqual(3);
        expect(stat.s.instruments.upserted).toEqual(4);
        expect(stat.s.instruments.new).toEqual(3);
        expect(stat.s.closingPricesSaved).toEqual(4);
      });
    });

    describe('Data in the DB must meet expectations', () => {
      [
        {
          symbol: 'A199999',
          country: ECountry.USA,
          cusip: '000303107',
          type: EInstrumentType.STOCK,
          shortDescription: 'Test INC CO',
          description: 'Test INC CO',
          feeds: ['APEX']
        },
        {
          symbol: 'A1999',
          country: ECountry.USA,
          cusip: '000304105',
          type: EInstrumentType.STOCK,
          shortDescription: 'Test TECHNOLOGIES H',
          description: 'Test TECHNOLOGIES H',
          feeds: ['APEX']
        },
        {
          symbol: 'LI',
          country: ECountry.USA,
          cusip: '50202M102',
          type: EInstrumentType.ETF, // Changed
          shortDescription: 'LI NEW SHORT DESCR', // Changed
          description: 'LI NEW DESCR', // Changed
          feeds: ['APEX', 'MORNING_STAR']
        },
        {
          symbol: 'PLUG',
          country: ECountry.USA,
          cusip: '72919P202',
          type: EInstrumentType.ETF, // Changed
          shortDescription: 'PLUG NEW SHORT DESCR', // Changed
          description: 'PLUG NEW DESCR', // Changed
          feeds: ['MORNING_STAR', 'APEX']
        }
      ].forEach(expected => {
        const { symbol } = expected;
        test(`Data for the instrument "${symbol}" must meet expectations`, async () => {
          const inst = await dbServiceTest.getInstrumentBySymbol(symbol);
          expect(inst).toMatchObject(expected);
          const stockPrices = await dbServiceTest.getInstrumentStockPrices([inst.id]);
          expect(stockPrices.length).toEqual(1);
        }, TIMEOUT_MILLIS);
      });
    });

    describe('Testing when a service should exit with an error:', () => {
      const { host } = config.apexExtracts.sftp;
      config.apexExtracts.daysBeforeCurrent = 3;

      test('There is no connection to the SFTP server', async () => {
        stat.reset();
        config.apexExtracts.sftp.host = 'foo_foo';

        await main.loadData();

        config.apexExtracts.sftp.host = host;

        const isENOTFOUND = stat.s.errors?.some(v => /SSH connection failed with error(.|\n)+ENOTFOUND/.test(v));
        expect(isENOTFOUND).toBe(true);
      }, TIMEOUT_MILLIS);

      test('There is no file for the date that must be', async () => {
        stat.reset();
        MockDate.set(DateTime.fromISO('2020-01-01').toJSDate());

        await main.loadData();

        MockDate.reset();
        expect(stat.s.errors.length).toBeGreaterThan(0);
      }, TIMEOUT_MILLIS);
    });
  });
});
