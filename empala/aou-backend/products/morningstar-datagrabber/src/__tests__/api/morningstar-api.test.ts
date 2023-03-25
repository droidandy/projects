import '../../init/init-config';
import * as _ from 'lodash';
import dayjs from 'dayjs';
import * as msApi from '../../morningstar-api';
import * as msApiExt from '../../morningstar-api-ext';
import { EMSAPICorpActionRT, EMSAPIPriceAdjustmentRT } from '../../morningstar-enums';
import { TESTING_MODE } from '../../constants';

const TIMEOUT_MILLIS = 30_000;

describe('Check environment variables', () => {
  test('It should be testing mode', () => {
    expect(TESTING_MODE).toBe(true);
  });
  test('Should receive variables properly', () => {
    expect(!!process.env.HASURA_GRAPHQL_ADMIN_SECRET).toBe(true);
  });
});

describe('MorningStar core API functions should work properly', () => {

  test('symbolGuide()', async () => {
    const result = await msApi.symbolGuide({
      exchange: '157',
      security: 1
    });
    expect(_.isObject(result[0])).toBe(true);
    expect(result[0].H1).toBe('A');
  }, TIMEOUT_MILLIS);

  test('symbolsActivePast10days()', async () => {
    const result = await msApi.symbolsActivePast10days({
      exchange: '157',
      security: 1
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBe('157.1.A');
  }, TIMEOUT_MILLIS);

  test('priceAndQuote() [by one symbol + fields list]', async () => {
    const fields = ['H1', 'H2', 'D2', 'D4', 'D6', 'S12'];
    const result = await msApi.priceAndQuote({
      exchange: '157',
      security: 1,
      symbols: 'GOOGL',
      fields
    });
    expect(_.isObject(result)).toBe(true);
    expect(Object.keys(result[0])).toStrictEqual(fields);
  }, TIMEOUT_MILLIS);

  test('priceAndQuote() [by symbols list]', async () => {
    const result = await msApi.priceAndQuote({
      exchange: '157',
      security: 1,
      symbols: ['FB', 'GOOGL']
    });
    expect(_.isObject(result)).toBe(true);
    expect(result.length).toBe(2);
  }, TIMEOUT_MILLIS);

  test('priceAndQuote() [by one investmentID]', async () => {
    const result = await msApi.priceAndQuote({
      exchange: '157',
      investmentIDs: 'E0USA04B8G'
    });
    expect(_.isObject(result)).toBe(true);
    expect(result[0].H1).toBe('GOOGL');
  }, TIMEOUT_MILLIS);

  test('newListings() [for today]', async () => {
    const result = await msApi.newListings({
      exchange: '157',
      security: 1,
      today: true
    });
    // Today is a relative term, so the result is always different
    expect(Array.isArray(result)).toBe(true);
  }, TIMEOUT_MILLIS);

  test('newListings()', async () => {
    const result = await msApi.newListings({
      exchange: '157',
      security: 1,
      sdate: dayjs(new Date()).add(-3, 'd').format('DD-MM-YYYY')
    });
    // For the selected period, instruments may or may not be added
    expect(Array.isArray(result)).toBe(true);
  }, TIMEOUT_MILLIS);

  test('deletedListings()', async () => {
    const result = await msApi.deletedListings({
      exchange: '157',
      security: 1,
      sdate: dayjs(new Date()).add(-3, 'd').format('DD-MM-YYYY'),
      edate: dayjs(new Date()).format('DD-MM-YYYY')
    });
    // For the selected period, instruments may or may not be deleted
    expect(Array.isArray(result)).toBe(true);
  }, TIMEOUT_MILLIS);

  test('endOfDayOHLCV()', async () => {
    const result = await msApi.endOfDayOHLCV({
      exchange: '157',
      security: 1,
      vwap: true
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].H1).toBe('A');
    expect(Object.keys(result[0]).includes('D17')).toBe(true); // D17 - open price
  }, TIMEOUT_MILLIS);

  test('exchangeInfo()', async () => {
    const result = await msApi.exchangeInfo({ exchange: '157' });
    expect(result[0].H1).toBe('EXCHANGEINFO');
  }, TIMEOUT_MILLIS);

  test('instrumentsInfo()', async () => {
    const result = await msApi.instrumentsInfo(['157.1.VOD', '157.1.MSFT', '157.1.A', '157.1.B', '157.1.GOOGL', '157.1.FB']);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].H1).toBe('VOD');
    expect(Object.keys(result[0]).includes('S1734')).toBe(true); // S1734 - Local Language Long Name
  }, TIMEOUT_MILLIS);

  test('historicalPriceAdjustments()', async () => {
    const result = await msApi.historicalPriceAdjustments({
      exchange: '157',
      requestType: EMSAPIPriceAdjustmentRT.ADJUSTED,
      sdate: dayjs().add(-10, 'd'),
      edate: dayjs().add(-3, 'd')
    });
    expect(result[0].data.length).toBeGreaterThan(0);
  }, TIMEOUT_MILLIS);

  test('corporateActions() / CORP_ACTIONS', async () => {
    const result = await msApi.corporateActions({
      exchange: '157',
      security: 1,
      symbols: 'AAPL',
      requestType: EMSAPICorpActionRT.CORP_ACTIONS,
      sdate: '01-08-2020'
    });
    expect(result[0].data.length).toBeGreaterThan(9);
  }, TIMEOUT_MILLIS);

  test('corporateActions() / NAME_CHANGES', async () => {
    const result = await msApi.corporateActions({
      exchange: '157',
      requestType: EMSAPICorpActionRT.NAME_CHANGES,
      sdate: '01-11-2021'
    });
    expect(result[0].data[0].name).toBeTruthy();
  }, TIMEOUT_MILLIS);

  test('priceHistory [MinBar]', async () => {
    const result = await msApi.priceHistory({
      exchange: '157',
      security: 1,
      symbols: ['A', 'B'],
      sdate: '01-04-2021',
      edate: '04-04-2021',
      etime: '16:30:30',
      type: 'MinBar'
    });
    expect(result.length).toBe(2);
    expect(Object.keys(result[0].data[0]).includes('D17')).toBe(true);  // D17 - open price
  }, TIMEOUT_MILLIS);

  test('priceHistory [DailyBar unadjusted]', async () => {
    const result = await msApi.priceHistory({
      exchange: '157',
      security: 1,
      symbols: ['FB', 'GOOGL'],
      sdate: '01-12-2008',
      edate: '04-04-2021',
      etime: '16:30:30',
      type: 'DailyBar',
      unadjusted: true
    });
    expect(result.length).toBe(2);
    expect(Object.keys(result[0].data[0]).includes('D17')).toBe(true);  // D17 - open price
  }, TIMEOUT_MILLIS);

  test('hisEODexchange()', async () => {
    const result = await msApi.hisEODexchange({
      exchange: '157',
      sdate: '05-10-2021'
    });
    expect(Object.keys(result[0]).includes('h')).toBe(true);
  }, TIMEOUT_MILLIS);

  test('symbolListForYear ()', async () => {
    const result = await msApi.symbolListForYear({
      exchange: '157',
      year: '2021'
    });
    expect(result[0].symbol).toBe('A');
  }, TIMEOUT_MILLIS);

  test('dailyBarsWithNoLongerTrading()', async () => {
    const result = await msApi.dailyBarsWithNoLongerTrading({
      exchange: '157',
      security: 1,
      symbols: ['A', 'B'],
      sdate: '01-01-2020',
      edate: '31-12-2020'
    });
    expect(result.length).toBe(2);
    expect(result[0].data.length).toBeGreaterThan(100);
  }, TIMEOUT_MILLIS);

  test('dailyBarsWithNoLongerTrading()', async () => {
    const result = await msApi.dailyBarsWithNoLongerTrading({
      instruments: ['157.1.GOOGL'],
      sdate: '01-01-2020',
      edate: '31-12-2020'
    });
    expect(result.length).toBe(1);
    expect(result[0].data.length).toBeGreaterThan(100);
  }, TIMEOUT_MILLIS);

  test('search()', async () => {
    const result = await msApi.search({
      exchange: '157',
      symbol: 'FB'
    });
    expect(result[0].H1).toBe('FB');
  }, TIMEOUT_MILLIS);

  test('search() [expect error]', async () => {
    try {
      await msApi.search({
        exchange: '157',
        symbol: 'FB',
        fields: ['S1012']
      });
    } catch (e: any) {
      expect(e.message).toContain('Invalid enablement request=157.1.FB');
    }
  }, TIMEOUT_MILLIS);


});

describe('MorningStar extended API functions should work properly', () => {
  test('enrichInstruments()', async () => {
    const { enriched } = await msApiExt.enrichInstruments(['157.1.MSFT', '157.1.GOOGL']);
    expect(enriched.map(({ symbol }) => symbol).includes('MSFT')).toBe(true);
  }, TIMEOUT_MILLIS);
});
