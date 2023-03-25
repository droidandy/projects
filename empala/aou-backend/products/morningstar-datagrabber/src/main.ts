/* eslint-disable no-await-in-loop */
import dayjs from 'dayjs';
import config from 'config';
import { exitOnError, logger } from './lib/logger';
import { CreateInstrumentInput, EFeed, EInstrumentType } from './types/gql-types';
import { arrayAMinusB } from './lib/lib';
import {
  DEBUG_MODE, EXCHANGES_USED, getMSExchangeCode, getMSSecurityId, TESTING_MODE,
} from './constants';
import { enrichInstruments, getSymbolsActivePast10DaysFromMS } from './morningstar-api-ext';
import * as dbService from './db-service';
import * as worker from './queue/worker';
import { addBulkJobs } from './queue/add-job';
import * as completionWatcher from './completion-watcher';
import stat from './lib/stat';
import { getSymbolNameChanges } from './symbol-name-changes';

/**
 * Saves new Instruments to the DB and replenishes the Map of Instruments
 */
const saveNewInstruments = async (
  instruments: CreateInstrumentInput[],
  instrumentsMap: InstrumentsMap,
  sdate: string,
  edate: string,
): Promise<void> => {
  if (DEBUG_MODE) {
    instruments = instruments.splice(0, 10);
  }

  logger.debug('Saving missing instruments...');
  const symbolNameChanges = await getSymbolNameChanges();

  const savedNewInstruments = await dbService.saveMissingInstruments(instruments, EFeed.MORNING_STAR, symbolNameChanges);
  savedNewInstruments.forEach((data) => {
    const {
      id, type, symbol, exchange: { name },
    } = data;
    const exchange = getMSExchangeCode(name);
    instrumentsMap[`${exchange}.${getMSSecurityId(type as EInstrumentType)}.${symbol}`] = {
      instrument: `${exchange}.1.${symbol}`, // See [note-1] for why security = 1 bat not real value
      type,
      id,
      sdate,
      edate,
    };
  });
};

/**
 * Returns the list of instruments for which historical price data will be loaded.
 *
 * - Gets from MorningStar the instruments that have been traded recently.
 * - Retrieves from the database a list of all instruments for which we receive data from MorningStar.
 *   For each instrument, among other things, this data contains the date for which the database contains prices.
 * - Subtracting the second from the first list, it reveals new instruments that are not in our database.
 * - Adds new instruments to the database, gets an ID for them.
 * - The combined list of old and new instruments, along with information about the latest date with prices,
 *   is returned
 */
const getInstrumentsToProcess = async (): Promise<InstrumentToProcess[]> => {
  // This map is used as a register of instruments for which we need to download prices
  const instrumentsMap: InstrumentsMap = {};

  const usedMSExchangesCodes: MSExchangeCode[] = EXCHANGES_USED.map((exchangeName) => getMSExchangeCode(exchangeName));

  logger.debug('Receiving lists of instruments from DB and MS API for creating a map...');

  stat.ping();
  let [instrumentsFromDb, instrumentsFromMS] = await Promise.all([
    dbService.getInstrumentsListFromDb(),
    getSymbolsActivePast10DaysFromMS(usedMSExchangesCodes),
  ]);

  stat.s.instruments.presentInDbOnStart = instrumentsFromDb.length;
  stat.ping();

  logger.info('Received lists of instruments from DB and MS API for creating a map');

  // Date from which we load historical data
  const loadPriceFrom = String(config.get('morningStar.loadPriceFrom'));
  const edate = dayjs().utc().format('YYYY-MM-DD');
  instrumentsFromDb.forEach((r: any) => {
    const exchange = getMSExchangeCode(r.exchangeName);
    const {
      id, lastPriceDate, symbol, type,
    } = r;
    const sdate = dayjs(lastPriceDate || loadPriceFrom).utc(true).add(1, 'd').format('YYYY-MM-DD');
    if (sdate <= edate) {
      instrumentsMap[`${exchange}.${getMSSecurityId(type)}.${symbol}`] = {
        instrument: `${exchange}.1.${symbol}`, // See [note-1] for why security = 1 bat not real value
        id,
        type,
        sdate,
        edate,
      };
    }
  });

  let newInstruments = arrayAMinusB(instrumentsFromMS, Object.keys(instrumentsMap));

  newInstruments = newInstruments.filter((v) => {
    const exchange = v.split('.')[0];
    if (usedMSExchangesCodes.includes(exchange)) {
      return true;
    }
    stat.s.instruments.excludedAsFromAnotherExchange.push(v);
    return false;
  });

  if (TESTING_MODE) {
    const testSymbols = ['MSFT', 'QQQ', 'GOOG', 'AAPL', 'SPY'];
    newInstruments = newInstruments.filter((v) => testSymbols.includes(v.split('.')[2]));
    Object.keys(instrumentsMap).forEach((key) => {
      const symbol = key.split('.')[2];
      if (!testSymbols.includes(symbol)) {
        delete instrumentsMap[key];
      }
    });
  }

  // TODO add in the map list of instruments traded in the last year
  // getNewSymbolsActiveLastYearFromMS()

  instrumentsFromDb = null;
  instrumentsFromMS = null;

  logger.debug('Enriching difference of instruments...');

  const {
    enriched,
    payload: {
      notEnrichedDueToLackOfShortDescription,
      notPresentInEnrichmentAnswer,
      otherSecurityTypes,
      excludedAsFromAnotherExchange,
    },
  } = await enrichInstruments(newInstruments);

  const u = notEnrichedDueToLackOfShortDescription.length;
  const l = notPresentInEnrichmentAnswer.length;
  logger.info(`Instruments enriched: ${enriched.length}`);
  if (u || l) {
    logger.warn(`Instruments ${u ? `not enriched due to lack of short description: ${u}. ` : ''}${l ? ` lost: ${l}` : ''}`);
  }

  stat.ping();
  stat.s.instruments.enrichedCount = enriched.length;
  stat.s.instruments.notEnrichedDueToLackOfShortDescription = notEnrichedDueToLackOfShortDescription;
  stat.s.instruments.otherSecurityTypes = otherSecurityTypes;
  stat.s.instruments.notPresentInEnrichmentAnswer = notPresentInEnrichmentAnswer;
  stat.s.instruments.excludedAsFromAnotherExchange.push(...excludedAsFromAnotherExchange);

  await saveNewInstruments(enriched, instrumentsMap, loadPriceFrom, edate);

  const instrumentsToProcess = Object.values(instrumentsMap).filter((v) => v);
  const toProcessCount = instrumentsToProcess.length;

  const deletedAsEmpty = Object.keys(instrumentsMap).length - toProcessCount;
  if (deletedAsEmpty) {
    logger.warn(`Instruments deleted from map as empty: ${deletedAsEmpty}`);
  }
  logger.info(`Instruments map was created. Total ${toProcessCount}`);

  stat.ping();
  stat.s.deletedAsEmpty = deletedAsEmpty;
  stat.s.instruments.toLoadPrices = toProcessCount;
  stat.s.instruments.newFromMS = toProcessCount - stat.s.instruments.presentInDbOnStart;

  instrumentsToProcess.reverse(); // First, let's load bars for new instruments
  return instrumentsToProcess;
};

const fillQueue = async (instrumentsToProcess: InstrumentToProcess[]): Promise<void> => {
  if (instrumentsToProcess.length) {
    await addBulkJobs(instrumentsToProcess);
    logger.info(`Added ${instrumentsToProcess.length} instruments to the queue for loading daily bars.`);
  } else {
    logger.info('No instruments to get prices for them');
  }
};

/**
 * Microservice launch
 */
export const main = async (): Promise<number> => {
  try {
    const { name } = await worker.init();
    logger.info(`Initialized Worker [${name}]`);
    const instrumentsToProcesses = await getInstrumentsToProcess();
    await fillQueue(instrumentsToProcesses);
    // After filling the queue, workers take over the job
  } catch (err) {
    exitOnError(err);
    return -3;
  }
  // We launch an observer that will terminate the microservice either after emptying the queues,
  // or when serious errors occur
  const completeState = await completionWatcher.watch();

  // Update prices materialized view if new prices have been added
  if (stat.s.dailyBarsSaved) {
    logger.info('Refresh prices materialized view...');
    await dbService.refreshPricesView();
  }
  return completeState;
};
