import { Job } from 'bullmq';
import { logger } from '../lib/logger';
import * as dbService from '../db-service';
import * as msApi from '../morningstar-api';
import { EFeed } from '../types/gql-types';
import stat from '../lib/stat';

/**
 * Gets daily bars for one instrument for the entire period
 */
const getDailyBarsForInstrument = async (instrumentToProcess: InstrumentToProcess): Promise<StockPricesDaily[]> => {
  const {
    instrument, id, sdate, edate,
  } = instrumentToProcess;
  const results = await msApi.dailyBarsWithNoLongerTrading({ instruments: [instrument], sdate, edate });
  /*
    If there is no data, the request will return
     {"ts":{"error":["No Data"],"results":[{"symbol":"ACWI","exchangeid":"157","type":"1","data":[]}]}}
     Here comes "results" with an empty array "data"
   */
  return results[0].data.map(({
    d, o, h, l, c,
  }: OHLCV) => ({
    /* eslint-disable camelcase */
    ts_date: d.replace(/^(\d\d)-(\d\d)-(\d{4})$/, '$3-$2-$1T00:00:00Z'),
    inst_id: id,
    price_open: o,
    price_close: c,
    price_high: h,
    price_low: l,
    feed: EFeed.MORNING_STAR,
    /* eslint-enable camelcase */
  }));
};

/**
 * Load and save daily bars for instrument
 */
export const processor = async (job: Job) => {
  const instrumentToProcess: InstrumentToProcess = job.data;
  const { instrument, id, sdate } = instrumentToProcess;
  logger.silly(`Getting daily bars for "${instrument}" ...`);

  stat.ping();
  stat.s.apiRequests.prices++;
  const startTime = Date.now();

  let stockPricesDaily = await getDailyBarsForInstrument(instrumentToProcess);

  stat.s.cumulativeTimeOfPricesRequests += (Date.now() - startTime);
  await job.updateProgress(30);
  stat.ping();

  if (stockPricesDaily.length) {
    logger.silly(`Saving daily bars for "${instrument}" ...`);
    const presentDalyPricesDates = await dbService.getPresenceOfDalyPricesForInstrument(id, sdate);
    await job.updateProgress(60);
    if (presentDalyPricesDates.length) {
      const was = stockPricesDaily.length;
      stockPricesDaily = stockPricesDaily.filter(({ ts_date: dateISO }) => !presentDalyPricesDates.includes(dateISO.substring(0, 10)));
      const excludedCount = was - stockPricesDaily.length;
      if (excludedCount) {
        logger.warn(`Found in DB and excluded from the list for saving ${excludedCount} daily bars for instrument "${instrument}"`);
      }
    }
    if (stockPricesDaily.length) {
      stat.s.dailyBarsSaved += await dbService.saveDailyBars(stockPricesDaily, instrument);
    }
  }

  await job.updateProgress(100);
  return { barsCount: stockPricesDaily.length };
};
