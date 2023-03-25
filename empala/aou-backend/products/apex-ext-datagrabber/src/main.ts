/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { DateTime } from 'luxon';
import { ISO_DATE_FORMAT } from './constants';
import { logger } from './lib/logger';
import config from './lib/config';
import * as utils from './lib/utils';
import * as dbService from './lib/db';
import * as sftp from './lib/sftp';
import stat from './lib/stat';
import { parseEXT747, ParseEXT747Result } from './lib/parser';

const instrumentsCache: InstrumentsCache = {};

export const loadAndExtractSODFile = async (
  reportDate: ISODateString,
  severity: number, // If the file must be, severity = 1, otherwise - 0
): Promise<ParseEXT747Result> => {
  const startTime = Date.now();

  stat.ping();

  // ====================== Downloading SOD file ==============================
  let localFilePath;
  try {
    localFilePath = await sftp.downloadSODFile(reportDate);
    stat.s.SODFiles.cumulativeDownloadTimeMs += (Date.now() - startTime);
    stat.s.SODFiles.datesToDownload[reportDate] = '✓';
  } catch (err) {
    // If an error occurred while loading the file, the statistic was not written. Do it here
    stat.s.SODFiles.cumulativeDownloadTimeMs += (Date.now() - startTime);
    stat.s.SODFiles.datesToDownload[reportDate] = stat.addError(err, severity);
    return undefined;
  }

  // ====================== Parsing SOD file ===================================
  try {
    const parseResult = await parseEXT747(localFilePath, reportDate);
    if (parseResult) {
      return parseResult;
    }
    /* istanbul ignore next */
    stat.addError(new Error(`SOD file ${localFilePath} is missing locally or empty`), severity);
  } catch (err) {
    /* istanbul ignore next */
    stat.addError(err, severity);
  }
  return undefined;
};

export const saveDataForOneDate = async (parseResult: ParseEXT747Result): Promise<void> => {
  let startTime = Date.now();

  stat.ping();
  let isErrorCritical = false;
  // Any errors that occur when working with the database are considered critical,
  // regardless of whether the file being processed is required (expected) or not
  try {
    const { instruments, closePriceBySymbolMap, reportDate } = parseResult;

    const cusipSymbolMap: { [cusip: string]: string } = {};
    instruments.forEach(({ cusip, symbol }) => {
      cusipSymbolMap[cusip] = symbol;
    });

    const newInstrumentsCount = instruments.filter(({ symbol }) => !instrumentsCache[symbol]).length;
    logger.debug(`${newInstrumentsCount} new instruments found in SOD file for ${reportDate}`);

    // ====================== Saving new instruments =============================

    startTime = Date.now();
    logger.debug(`Saving ${instruments.length} instruments...`);

    const savedInstruments: ShortInstrumentData[] = [];

    /* istanbul ignore next */
    while (instruments.length) {
      const batch = instruments.splice(0, config.instrumentsPerUpsert);
      try {
        // eslint-disable-next-line no-await-in-loop
        const saveResult = await dbService.upsertInstruments(batch);
        savedInstruments.push(...saveResult || []);
      } catch (err: Error | any) {
        // We do not interrupt the program execution to allow the rest of the data packages to be saved,
        // but we save the error and signal the error at the end
        /* istanbul ignore next */
        stat.addError(err, 1);
      }
    }

    // Updating their APEX tools is done using the cusip key. The symbol value is unchanged.
    // At the same time, there may be renamed symbols in the instruments.inst table (as reported from MorningStar).
    // In response to a request to save instruments, information may be received with updated symbol names.
    // Update closePriceBySymbolMap & instrumentsCache
    savedInstruments.forEach(({ id, symbol, cusip }) => {
      const oldSymbol = cusipSymbolMap[cusip];
      if (oldSymbol !== symbol) {
        const price = closePriceBySymbolMap[oldSymbol];
        if (price) {
          delete closePriceBySymbolMap[oldSymbol];
          closePriceBySymbolMap[symbol] = price;
        }
      }
      instrumentsCache[symbol] = id;
    });

    stat.s.instruments.upserted += savedInstruments.length;
    stat.s.instruments.new += newInstrumentsCount;
    logger.info(`Saved ${savedInstruments.length} instruments (from SOD file for ${reportDate}) ${utils.timeTaken(startTime)}`);

    // ====================== Saving daly close prices ===========================

    /* eslint-disable camelcase */
    const closePriceData: ClosePriceData[] = [];

    Object.entries(closePriceBySymbolMap).forEach(([symbol, price_close]) => {
      closePriceData.push(
        {
          ts_date: reportDate,
          inst_id: instrumentsCache[symbol],
          feed: 'APEX',
          price_close,
        },
      );
    });

    startTime = Date.now();
    const pricesCount = closePriceData.length;
    logger.debug(`Saving ${pricesCount} close prices for ${reportDate}...`);

    // We save prices per day with one request. So, that would either keep all prices, or nothing.
    // An error when saving prices for one of the dates stops the service in order to eliminate
    // the appearance of gaps in prices
    isErrorCritical = true;
    await dbService.saveInstrumentPriceClose(closePriceData);
    stat.s.closingPricesSaved += pricesCount;
    logger.info(`Saved ${pricesCount} closing prices of ${reportDate}. ${utils.timeTaken(startTime)}`);
    stat.ping();
  } catch (err: Error | any) /* istanbul ignore next */ {
    if (isErrorCritical) {
      utils.truncateVariablesInErrorMessage(err);
      throw err;
    }
    stat.addError(err, 1);
  }
};

/*
   Algorithm

   Get a list (1) of all working days within the interval (30d)
   Get a list (2) of all dates for which there are prices in the database (within the interval)
   Get the difference (3) "list 1" - "list 2" - a list of working days for which we want to load data.
   If the list is empty, exit (exit code = 0 OK)

   If list (3) is not empty:

   Determine the date of the last working day. If the data for this day is not yet in the database
   and we cannot load it, then such a case will be considered as a significant error.

   Load data in turn starting from the last date from the list (3)
   If the loaded date is equal to the date of the last working day and the file cannot be loaded,
   then we generate a message about this error and put it on the error stack.

   If the loaded date is NOT equal to the date of the last working day and the file cannot be loaded,
   then we generate a warning about this and put it on the warning stack.

   Any other exceptions that are thrown during operation are stored on the error stack as an "error".
   When the entire list (3) has finished loading, we evaluate the contents of the error stack:
   if it contains an "error", then (exit code = 1 ERROR).
*/
export const loadData = async (): Promise<void> => {
  const currentDateIso = DateTime.now().toFormat(ISO_DATE_FORMAT);

  const fromDate: ISODateString = utils.subtractDays(currentDateIso, config.apexExtracts.daysBeforeCurrent);
  const businessDays: ISODateString[] = utils.getBusinessDaysInRange(fromDate, currentDateIso);
  const existingPriceDates: ISODateString[] = await dbService.getExistingPriceDates(fromDate, currentDateIso);

  const datesToDownload: ISODateString[] = utils.getReportDates(existingPriceDates, businessDays);
  stat.s.SODFiles.total = datesToDownload.length;
  /* istanbul ignore if */
  if (datesToDownload.length === 0) {
    logger.info('All available extract files already saved into DB');
    return;
  }

  // Filling in the cache with instruments that already exist in DB for the US country and feed APEX
  await dbService.fillInstrumentsCache(instrumentsCache);
  stat.s.instruments.wasInFeed = Object.keys(instrumentsCache).length;

  const expectedReportDate: ISODateString = utils.getExpectedReportDate();
  stat.s.expectedReportDate = expectedReportDate;
  logger.info(`Expected report date: ${expectedReportDate}`);

  // Downloading files can be done in parallel
  const parseResults: ParseEXT747Result[] = await Promise.all(
    datesToDownload.map((reportDate: ISODateString) => {
      stat.s.SODFiles.datesToDownload[reportDate] = 'downloading...'; // Initializing statistics
      return loadAndExtractSODFile(reportDate, expectedReportDate === reportDate ? 1 : 0);
    }),
  );

  // We save data in the database sequentially
  for (const parseResult of parseResults) {
    if (parseResult) {
      await saveDataForOneDate(parseResult);
    }
  }

  await dbService.refreshPricesView();
};

/* istanbul ignore next */
export const main = async (): Promise<number> => {
  let exitCode = 0;
  try {
    await loadData();
    if (stat.s.errors.length) {
      logger.error(stat.firstError);
      exitCode = 1;
    }
  } catch (err: Error | any) {
    logger.error(err);
    exitCode = 1;
  }
  stat.print();
  return exitCode;
};
