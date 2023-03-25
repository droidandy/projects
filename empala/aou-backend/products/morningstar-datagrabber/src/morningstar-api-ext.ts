/* eslint-disable no-await-in-loop */
/*
The module contains functions that receive data through the morningstar-api.ts core functions.
But these functions include additional logic to process the received data.
 */

import { CreateInstrumentInput, ECountry, EInstrumentType } from './types/gql-types';
import {
  DEBUG_MODE,
  EXCHANGES_USED,
  getExchangeName,
  getInstrumentType,
  getMSExchangeCode,
  getMSSecurityIdByGlobalIdInvestmentType,
  SYMBOLS_IN_REQUEST,
} from './constants';
import * as msApi from './morningstar-api';
import stat from './lib/stat';
import { sleep, unionArraysUnique } from './lib/lib';
import { logger } from './lib/logger';

/*
Interval, ms, is used to control compliance with the limit on the number of symbols that can be requested per second
 */
const RATE_LIMITING_INTERVAL_FOR_INSTRUMENTS = 1100;

/*
We have to enrich instruments twice:
first, when we receive a list of instruments traded in the last 10 days (Symbol Guide),
and then, when adding additional ones, from the list of traded during the last year.
To speed up, we use the cache of enriched instruments.
 */
const enrichedInstrumentsCache: Record<string, CreateInstrumentInput> = {};

/**
 * Converts the string "<MSExchangeCode>.<MSSecurityId>.<symbol>" to "<MSExchangeCode>.<symbol>"
 * The typeless instrument identifier is used to compare instrument lists and as a key in the enriched instruments cache.
 * This is done because there is no real information about the type in the information about the instrument
 * supplied for enrichment.
 */
const stripSecurityTypeFromInstrument = (instrument: MSAPIInstrument) => instrument.replace(/\.([^.]+)\./, '.');

/**
 * Enriches the given symbols with additional information. MaxRetry attempts are given in total
 */
const getInstrumentsInfo = async (packet: MSAPIInstruments, maxRetry = 5, retryDelayMillis = 1000) => {
  let tryNumber = 1;
  while (tryNumber <= maxRetry) {
    if (tryNumber > 1) {
      logger.warn(`Attempt number ${tryNumber} to enrich instruments`);
    }
    try {
      return await msApi.instrumentsInfo(packet);
    } catch (err: Error | any) {
      if (tryNumber < maxRetry) {
        logger.prettyError(err, true, !err[Symbol.for('noExposeCodeFrame')]);
      } else {
        throw err;
      }
    }
    await sleep(retryDelayMillis);
    tryNumber++;
  }
  return [];
};

/**
 * Enriches the given symbols with additional information: Company name (short and full)
 */
export const enrichInstruments = async (
  instrumentsToEnrich: MSAPIInstrument[],
): Promise<{ enriched: CreateInstrumentInput[]; payload: any }> => {
  const enriched: CreateInstrumentInput[] = [];
  const usedMSExchangesCodes: MSExchangeCode[] = EXCHANGES_USED.map((exchangeName) => getMSExchangeCode(exchangeName));

  const workArray: MSAPIInstrument[] = [];
  instrumentsToEnrich.forEach((instrument) => {
    const key = stripSecurityTypeFromInstrument(instrument);
    const cached = enrichedInstrumentsCache[key];
    if (cached) {
      enriched.push(cached);
    } else {
      // We must replace the real security Id with 1. Otherwise, the tools will be thrown out of the response.
      // This MorningStar behavior
      workArray.push(instrument.replace(/\.([^.]+)\./, '.1.'));
    }
  });

  // TODO: We need to figure out what to do with the unenriched instruments. Why are not all symbols enriched?
  // The "shortdescription" field cannot be empty, but we have nothing to fill it with.
  const notPresentInEnrichmentAnswer: MSAPIInstruments = [];
  const notEnrichedDueToLackOfShortDescription: MSAPIInstruments = [];
  const otherSecurityTypes: MSAPIInstruments = [];
  const excludedAsFromAnotherExchange: MSAPIInstruments = [];

  while (workArray.length && (!DEBUG_MODE || enriched.length < 100)) {
    const startLoopTs = Date.now();
    const packet = workArray.splice(0, SYMBOLS_IN_REQUEST);
    const instrumentsInfo = await getInstrumentsInfo(packet);

    // Collecting not enriched instruments for statistics.
    if (instrumentsInfo.length < packet.length) {
      const symbolsReceivedBack = instrumentsInfo.map(({ H1 }) => H1);
      notPresentInEnrichmentAnswer.push(...packet.filter((s) => !symbolsReceivedBack.includes(s.split('.')[2])));
    }

    stat.ping();
    stat.s.apiRequests.instrumentsInfo++;

    instrumentsInfo.forEach((instrumentInfo) => {
      const {
        H1: symbol, H2: exchangeCode, S12: shortDescription, S1734: description, S1735,
      } = instrumentInfo;
      const msSecurityId = getMSSecurityIdByGlobalIdInvestmentType(S1735);
      const instrumentType: EInstrumentType = msSecurityId && getInstrumentType(msSecurityId);
      if (!instrumentType) {
        // Angle brackets around the tool type indicate that we are not showing the code, but the type name
        otherSecurityTypes.push(`${exchangeCode}.<${S1735}>.${symbol}`);
        return;
      }
      if (!usedMSExchangesCodes.includes(exchangeCode)) {
        excludedAsFromAnotherExchange.push(`${exchangeCode}.<${S1735}>.${symbol}`);
        return;
      }
      const instrument = `${exchangeCode}.${msSecurityId}.${symbol}`;
      instrumentInfo.i = instrument;

      if (shortDescription) {
        const createInstrumentInput: CreateInstrumentInput = {
          symbol,
          cusip: null, // TODO add CUSIP after after we start getting it from the MS
          sedol: null,
          type: instrumentType,
          exchangeName: getExchangeName(exchangeCode),
          description,
          shortDescription,
          country: ECountry.USA,
        };
        enriched.push(createInstrumentInput);
        enrichedInstrumentsCache[instrument] = createInstrumentInput;
      } else {
        // Collecting instruments without Company Name for statistics.
        notEnrichedDueToLackOfShortDescription.push(instrument);
      }
    });

    // Limiting the rate of symbols requests
    await sleep(Math.max(0, RATE_LIMITING_INTERVAL_FOR_INSTRUMENTS - (Date.now() - startLoopTs)));
  }
  return {
    enriched,
    payload: {
      notEnrichedDueToLackOfShortDescription,
      notPresentInEnrichmentAnswer,
      otherSecurityTypes,
      excludedAsFromAnotherExchange,
    },
  };
};

/**
 * Returns all instruments that have been active past 10 days.
 */
export const getSymbolsActivePast10DaysFromMS = async (
  exchanges: MSExchangeCode[],
): Promise<string[]> => {
  const functions: any = [];

  exchanges.forEach((exchange) => {
    /* [note-1]
     At the moment (2021-10-21) MorningStar accepts only one value "1" for request parameter "security".
     But at the same time it returns a list of instruments of all types of securities.
     */
    functions.push(msApi.symbolsActivePast10days({ exchange, security: 1 }));
    stat.s.apiRequests.symbolGuide++;
  });
  const symbolsFromMS = await Promise.all(functions);
  return unionArraysUnique(...symbolsFromMS);
};

/**
 * Returns all NEW instruments that have been active last year.
 *
 * The request for a list of instruments traded in the last year does not return field S1735,
 * which contains the real type of instrument.
 * Therefore, after receiving a complete list, we exclude the known instruments, and the remainder is enriched.
 export const getNewSymbolsActiveLastYearFromMS = async (
 exchanges: MSExchangeCode[],
 securities: MSSecurityId[],
 excludeKnownInstruments: MSAPIInstrument[]
 ): Promise<string[]> => {
  // TODO Connect to receive a list of instruments traded over the last year
  const newSymbols: string[] = [];
  return newSymbols;
};
 */
