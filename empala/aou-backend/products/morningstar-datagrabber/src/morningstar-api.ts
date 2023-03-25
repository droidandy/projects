/*
The module provides functions for working with the MorningStar API

Links to documentation are provided in the comments:
[MS-WS-SPEC] = "Morningstar Web Services Specification" v7.1
 */

import dayjs, { Dayjs } from 'dayjs';
import config from 'config';
import { logger } from './lib/logger';
import { EMSAPICorpActionRT, EMSAPIEndpoint, EMSAPIPriceAdjustmentRT } from './morningstar-enums';
import { getMSSecurityIdByGlobalIdInvestmentType, SYMBOLS_IN_REQUEST } from './constants';
import { error } from './lib/lib';
import fetch from './lib/fetch';
import { myIP } from './lib/my-ip';

const TIMEZONE_DEFAULT = config.get('morningStar.defaultTimezone');
const PROTOCOL = config.get('morningStar.protocol');
const HOST = config.get('morningStar.host'); // ms(t|h|u)xml.(morningstar|tenfore).com
const CREDENTIALS = `username=${config.get('morningStar.user')}&password=${config.get('morningStar.password')}`;

/**
 * Normalizes the date to MS API format: DD-MM-YYYY
 */
const normalizeDateValue = (date: string | Date | Dayjs): string => {
  if (typeof date === 'string') {
    if (/^\d\d-\d\d-\d{4}/.test(date)) {
      return date.substring(0, 10);
    }
    const re = /^(\d{4})-(\d\d)-(\d\d)/;
    if (re.test(date)) {
      return date.replace(re, '$3-$2-$1');
    }
  }
  return dayjs(date).format('DD-MM-YYYY');
};

/**
 * Request to MorningStar server for data
 * @param endPoint
 * @param query - meaningful request parameters (no authentication parameters and JSON response modifier)
 */
export const requestMorningStar = async (endPoint: EMSAPIEndpoint, query = ''): Promise<MSAPIResponse> => {
  const startTime = Date.now();
  query = query.replace(/^&/, '');
  const uri = `${PROTOCOL}://${HOST}/${endPoint}?${CREDENTIALS}&JSONShort&${query}`;
  if (logger.isLevel('silly')) {
    const ourIP = await myIP();
    logger.silly(`Request to MorningStar [from ${ourIP || 'unknown IP'}]: ${uri}`);
  }
  const data: any = await fetch(uri);

  const rootName = endPoint === EMSAPIEndpoint.INDEX_TS ? 'ts' : 'quotes';

  if (!data?.[rootName]) {
    error(`Response missing expected property '${rootName}'. URL: ${uri}`);
  }
  if (data[rootName].error) {
    const errMsg = data[rootName].error[0];
    // For the indexTS endpoint, ignore the "No Data" error (the results property there contains an empty array)
    if (errMsg !== 'No Data') {
      error(`${data[rootName].error[0]}. URL: ${uri}`);
    }
  }
  logger.silly(`HTTP Response received in [${Date.now() - startTime} ms]`);
  return data[rootName];
};

/**
 * Returns query string fragment with those parameters from the list that are present in the "parameters" object
 */
const serializeToQueryParams = (parameters: { [key: string]: any }, paramNameList: string[]): string => {
  let query = '';
  Object.entries(parameters).forEach(([name, value]) => {
    if (paramNameList.includes(name)) {
      switch (name) {
        case 'fields':
          value = value.join(',');
          break;
        case 'sdate':
        case 'edate':
          value = normalizeDateValue(value);
          break;
        default:
      }
      query += `&${name}=${value}`;
    }
  });
  return query;
};

/**
 * Returns query string fragment with those flags from the list that are present in the "parameters" object
 * (Parameters are added as flags - no values. Ex: &flag1&flag2)
 */
const serializeToQueryFlags = (parameters: { [key: string]: any }, paramNameList: string[]): string => {
  let query = '';
  paramNameList.forEach((p) => {
    if (p in parameters) {
      query += `&${p}`;
    }
  });
  return query;
};

/**
 * Returns a value for the "instrument" request parameter.
 * In general, this is a list (sep = ,) of strings of the form "<exchange>.<security>.<symbol>".
 * Example: &instrument=151.1.VOD,240.20.GBPUSDCOMP
 */
const getInstrumentParamBySymbols = (
  fnName: string,
  exchange: MSExchangeCode,
  security: MSSecurityId,
  symbols: MSAPISymbols,
  leadingAmpersand?: boolean,
): string => {
  if (!Array.isArray(symbols)) {
    symbols = [symbols];
  }
  if (!exchange || !security) {
    error(`One of the 'exchange' or 'security' parameters was not passed along with the 'symbols' parameter in the '${fnName}' request`);
    return '';
  }
  if (symbols.length > SYMBOLS_IN_REQUEST) {
    error(`Exceeded the number of instruments transferred in one request '${fnName}' (${symbols.length} > ${SYMBOLS_IN_REQUEST})`);
    return '';
  }
  return `${leadingAmpersand ? '&' : ''}instrument=${symbols.map((s) => `${exchange}.${security}.${s}`).join(',')}`;
};

/**
 * Returns a value for the "instrument" request parameter.
 * In general, this is a list (sep = ,) of strings of the form "<exchange>.<security>.<symbol>".
 * Example: &instrument=151.1.VOD,240.20.GBPUSDCOMP
 */
const getInstrumentParam = (
  fnName: string,
  instruments: MSAPIInstruments,
  leadingAmpersand?: boolean,
): string => {
  if (!Array.isArray(instruments)) {
    instruments = [instruments];
  }
  if (instruments.length > SYMBOLS_IN_REQUEST) {
    error(`Exceeded the number of instruments transferred in one request '${fnName}' (${instruments.length} > ${SYMBOLS_IN_REQUEST})`);
    return '';
  }
  return `${leadingAmpersand ? '&' : ''}instrument=${instruments.join(',')}`;
};

/**
 * Returns a query fragment for containing parameter "exchange" and "investmentID"
 * which value is list of MorningStar investment IDs separated by ",".
 */
const getInvestmentIDsParam = (
  fnName: string,
  exchange: MSExchangeCode,
  investmentIDs: MSAPIInvestmentIDs,
  leadingAmpersand?: boolean,
): string => {
  if (!Array.isArray(investmentIDs)) {
    investmentIDs = [investmentIDs];
  }
  if (!exchange) {
    error(`The 'exchange' parameter was not passed along with the 'investmentIDs' parameter in the '${fnName}' request`);
  }
  if (investmentIDs.length > SYMBOLS_IN_REQUEST) {
    error(`Exceeded the number of instruments transferred in one request '${fnName}' (${investmentIDs.length} > ${SYMBOLS_IN_REQUEST})`);
  }
  return `${leadingAmpersand ? '&' : ''}investmentid=${investmentIDs.join(',')}`;
};

/**
 * Returns a value for the "perfID" request parameter which is list of MorningStar perfIDs separated by ",".
 */
const getPerfIDsParam = (fnName: string, perfIDs: MSAPIPerfIDs): string => {
  if (!Array.isArray(perfIDs)) {
    perfIDs = [perfIDs];
  }
  if (perfIDs.length > SYMBOLS_IN_REQUEST) {
    error(`Exceeded the number of instruments transferred in one request '${fnName}' (${perfIDs.length} > ${SYMBOLS_IN_REQUEST})`);
  }
  return `perfID=${perfIDs.join(',')}`;
};

const applyTimeZone = (parameters: any): void => {
  if (!parameters.timezone) {
    parameters.timezone = TIMEZONE_DEFAULT;
  }
};

/**
 * The core for the index.php endpoint
 */
export const indexPhp = async (parameters: MSAPIPriceAndQuoteRequest): Promise<MSAPIResults> => {
  const fnName = 'indexPhp';
  let query: any = '';
  if ('symbols' in parameters) {
    const { exchange, security, symbols } = parameters;
    query = getInstrumentParamBySymbols(fnName, exchange, security, symbols);
    delete parameters.exchange;
    delete parameters.security;
  } else if ('instruments' in parameters) {
    query = getInstrumentParam(fnName, parameters.instruments);
  } else if ('investmentIDs' in parameters) {
    const { exchange, investmentIDs } = parameters;
    query = getInvestmentIDsParam(fnName, exchange, investmentIDs);
  } else if ('perfIDs' in parameters) {
    query = getPerfIDsParam(fnName, parameters.perfIDs);
  } else if (!('eodDownload' in parameters || 'exchangeInfo' in parameters)) {
    error(`None of the parameters (symbols, investmentIDs, perfIDs) were found in the '${fnName}' request`);
  }
  query += serializeToQueryParams(parameters, ['instrument', 'exchange', 'security', 'fields', 'timezone', 'exchangeInfo']);
  query += serializeToQueryFlags(parameters, ['vwap', 'eodDownload']);
  const quotes = await requestMorningStar(EMSAPIEndpoint.INDEX_PHP, query);
  return quotes.results;
};

/**
 * Returns price and quote information for either single or multiple instruments.
 * [MS-WS-SPEC] 6.2 Price and Quote Requests]
 */
export const priceAndQuote = async (parameters: MSAPIPriceAndQuoteRequest): Promise<MSAPIResults> => {
  applyTimeZone(parameters);
  return indexPhp(parameters);
};

/**
 * The core function for the new/deleted Listings API functions.
 */
const listings = async (
  listingParameter: string,
  parameters: MSAPISecurityOfExchange & MSAPIDateInterval & MSAPITimeInterval,
): Promise<MSAPIResults> => {
  const { exchange, security } = parameters;
  const query = `exchange=${exchange}&security=${security}&${listingParameter}${
    serializeToQueryParams(parameters, ['sdate', 'edate', 'stime', 'etime'])}`;
  const quotes = await requestMorningStar(EMSAPIEndpoint.CHANGES, query);
  return quotes.results;
};

/**
 * Returns instruments that have been listed for a specific date within the last 7 days
 * for a specific exchange and asset class.
 * [MS-WS-SPEC] 6.4 New Listings]
 *
 * A maximum of 5000 new instruments will be displayed.
 * Note: The default time range will be today unless otherwise specified.
 */
export const newListings = async (
  parameters: MSAPISecurityOfExchange & MSAPIDateInterval & MSAPITimeInterval & { today?: boolean },
): Promise<MSAPIResults> => listings('newsymbols', parameters);

/**
 * Returns instruments that have been deleted for a specific date within the last 7 days
 * for a specific exchange and asset class.
 * [MS-WS-SPEC] 6.5 Deleted Listings]
 *
 * A maximum of 5000 deleted instruments will be displayed.
 * Note: The default time range will be today unless otherwise specified.
 */
export const deletedListings = async (
  parameters: MSAPISecurityOfExchange & MSAPIDateInterval & MSAPITimeInterval,
): Promise<MSAPIResults> => listings('delsymbols', parameters);

/**
 * Returns the Open, High, Low, Close and Volume data for all instruments which traded the previous day on an exchange.
 * [MS-WS-SPEC] 6.6 End-Of-Day OHLCV]
 *
 * Note: No concurrent EoD Download requests can be made.
 *
 * Returned fields:
 *  H1      - Morningstar ticker symbol
 *  H2      - Morningstar exchange ID. See section 2.
 *  H3      - Morningstar security type. See section 3.
 *  D2      - Last price
 *  D16     - Cumulative volume
 *  D17     - Open price
 *  D18     - High price
 *  D19     - Low price
 *  D204    - Traded Currency
 *  [D243]  - VWAP price (frac)
 *  D770    - Time of last update to last inc seconds
 *  D784    - Date of last trade
 *  D5215   - Cumulative number of shares traded today as reported to the CTA and UTP SIPsT
 *  S9      - Listed Currency
 *  S12     - Issuer name || Company name
 */
export const endOfDayOHLCV = async (
  parameters: MSAPISecurityOfExchange & { timezone?: string; vwap?: boolean },
): Promise<MSAPIResults> => {
  applyTimeZone(parameters);
  return indexPhp({ ...parameters, eodDownload: true });
};

/**
 * Returns exchange metadata for each asset class: Open time, Close time, Special dates, Time zone, Official end-of-day.
 * [MS-WS-SPEC] 6.7 Exchange Information]
 */
export const exchangeInfo = async (
  { exchange }: { exchange: MSExchangeCode },
): Promise<MSAPIResults> => indexPhp({ exchangeInfo: exchange });

/**
 * Returns short information for a list of instruments for a specified exchange and instrument type
 * The short and full name of the company is returned
 * The list of instruments is specified by an array of symbols.
 */
export const instrumentsInfo = async (
  instruments: MSAPIInstruments,
): Promise<MSAPIResults> => indexPhp({ instruments, fields: ['H1', 'H2', 'H3', 'S12', 'S1734', 'S1735'] });

/**
 * Returns both adjusted and unadjusted price changes for a specified time range per exchange.
 * [MS-WS-SPEC] 6.8 Historical Price Adjustments]
 */
export const historicalPriceAdjustments = async (
  parameters: { exchange: MSExchangeCode; requestType: EMSAPIPriceAdjustmentRT } & MSAPIDateInterval,
): Promise<MSAPIResults> => {
  const { exchange, requestType } = parameters;
  const query = `exchange=${exchange}&${requestType}${
    serializeToQueryParams(parameters, ['sdate', 'edate'])}`;
  const quotes = await requestMorningStar(EMSAPIEndpoint.INDEX_TS, query);
  return quotes.results;
};

/**
 * Returns all instruments that have been active in the past 10 days on the specified exchange.
 * [MS-WS-SPEC] 6.11 Symbol Guide]
 */
export const symbolGuide = async ({ exchange, security }: MSAPISecurityOfExchange): Promise<MSAPIResults> => {
  const query = `exchange=${exchange}&security=${security}`;
  const quotes = await requestMorningStar(EMSAPIEndpoint.SYMBOL_GUIDE, query);
  return quotes.results;
};

/**
 * Returns list of all instruments that have been active in the past 10 days on the specified exchange.
 */
export const symbolsActivePast10days = async (
  { exchange, security }: MSAPISecurityOfExchange,
): Promise<any[]> => {
  const results = await symbolGuide({ exchange, security });
  return results
    .map(({ H1: symbol, S1735 }) => {
      const msSecurityId = getMSSecurityIdByGlobalIdInvestmentType(S1735);
      return { symbol, msSecurityId };
    })
    .filter(({ msSecurityId }) => msSecurityId)
    .map(({ symbol, msSecurityId }) => `${exchange}.${msSecurityId}.${symbol}`);
};

/**
 * Returns corporate actions data for a specific instrument or for an entire exchange,
 * from a specific date and as far forward as available.
 * [MS-WS-SPEC] 7.2  Corporate Actions & Name Changes]
 */
export const corporateActions = async (
  parameters: (
    MSAPIInstrumentsObject
    | MSAPISecurityOfExchange
    | { instruments: MSAPIInstruments }
  ) & {
    requestType: EMSAPICorpActionRT;
    sdate?: any;
  },
): Promise<MSAPIResults> => {
  const fnName = 'corporateActions';
  const { requestType } = parameters;
  let query = `${requestType}`;
  if ('symbols' in parameters) {
    const { symbols, exchange, security } = parameters;
    query += getInstrumentParamBySymbols(fnName, exchange, security, symbols, true);
  } else if ('instruments' in parameters) {
    query += getInstrumentParam(fnName, parameters.instruments, true);
  } else {
    query += serializeToQueryParams(parameters, ['exchange', 'security']);
  }
  query += serializeToQueryParams(parameters, ['sdate']);
  const quotes = await requestMorningStar(EMSAPIEndpoint.INDEX_TS, query);
  return quotes.results;
};

/**
 * Returns raw tick data or user-defined minute bars.
 * You can request to include or exclude pre- and post-market activity.
 * Depending on the amount of data requested, the response will either be immediate or will provide a link to a file
 * containing the data.
 *
 * A response will be sent immediately if you request:
 * ▪ Today’s tick data only
 * ▪ Minute bar data and period is 15 calendar days or fewer
 * ▪ Hour bar data
 *
 * A response will be sent via file links if you request:
 * ▪ Historic tick data (that is to say, not today’s data)
 * ▪ Minute bar data and period is more than a week
 *
 * The XML response will contain a message with a number of trades or bars.
 * For each day, there can be an optional <dayprice> element which consists
 * of the open and close price for the whole day.
 * If the exchange has multiple closes this will be the final close when it’s available;
 * before that, it will be the initial close prices. If a close price is not available for the day,
 * then this element will not be returned.
 * If a field is not available, it will not be present in the XML stream.
 *
 * [MS-WS-SPEC] 7.3 Price History
 */
export const priceHistory = async (parameters: MSAPIPriceHistoryRequest): Promise<MSAPIResults> => {
  const fnName = 'priceHistory';
  let query = '';
  const paramsWithValue = [
    'type',
    'interval',
    'ISIN',
    'calendarDays',
    'tradingDays',
    'numBars',
    'sdate',
    'edate',
    'stime',
    'etime',
  ];
  if ('symbols' in parameters) {
    const { exchange, security, symbols } = parameters;
    query = getInstrumentParamBySymbols(fnName, exchange, security, symbols);
  } else {
    paramsWithValue.push('exchange', 'security');
  }

  query += serializeToQueryParams(parameters, paramsWithValue);
  query += serializeToQueryFlags(parameters, [
    'singleDataPoint',
    'today',
    'listingExch',
    'symbolList',
    'fullSearch',
    'hisEODExchange',
    'nanoseconds',
    'openClose',
    'openInterest',
    'prePost',
    'tradCond',
    'unadjusted',
    'VWAP',
  ]);

  const quotes = await requestMorningStar(EMSAPIEndpoint.INDEX_TS, query);
  return quotes.results;
};

/**
 * Returns OHLCV for all instruments on an exchange that traded on a specific day any time in the past
 * that the system has data for.
 * [MS-WS-SPEC] 7.3.4 Requesting Historical Data for an Exchange for a Single Day]
 */
export const hisEODexchange = async (
  { exchange, sdate }: { exchange: MSExchangeCode; sdate: any },
): Promise<SymbolOHLCV[]> => {
  const results = await priceHistory({ exchange, sdate, hisEODExchange: true });
  return results.map(({ symbol, data = [] }) => {
    const {
      D17: o, D18: h, D19: l, D2: c, D16: v,
    } = data[0] || {};
    return {
      symbol,
      o: Number(o) || null,
      h: Number(h) || null,
      l: Number(l) || null,
      c: Number(c) || null,
      v: Number(v) || null,
    };
  });
};

/**
 * Returns a list of instruments that traded on the specified exchange during the specified year.
 * [MS-WS-SPEC] 7.3.5 - Requesting Data for Instruments Including No Longer Trading]
 */
export const symbolListForYear = async (
  { exchange, year }: { exchange: MSExchangeCode; year: string },
): Promise<{ exchange: MSExchangeCode; security: MSSecurityId; symbol: string }[]> => {
  const results = await priceHistory({ exchange, sdate: `01-01-${year}`, symbolList: true });
  return results.map(({ type: security, symbol }) => ({ exchange, security, symbol }));
};

/**
 * Returns a daily bars for each days that instrument traded in specified period Including No Longer Trading.
 * [MS-WS-SPEC] 7.3.5 Requesting Data for Instruments Including No Longer Trading]
 */
export const dailyBarsWithNoLongerTrading = async (
  parameters: (MSAPIInstrumentsObject | { instruments: MSAPIInstruments }) & { sdate: any; edate: any; fields?: string[] },
): Promise<MSAPIResults> => {
  const fnName = 'dailyBarsWithNoLongerTrading';
  let query = 'fullsearch&type=dailybar&';
  applyTimeZone(parameters);
  if ('symbols' in parameters) {
    const { exchange, security, symbols } = parameters;
    query += getInstrumentParamBySymbols(fnName, exchange, security, symbols);
  } else {
    query += getInstrumentParam(fnName, parameters.instruments);
  }
  query += serializeToQueryParams(parameters, ['sdate', 'edate', 'fields']);
  const quotes = await requestMorningStar(EMSAPIEndpoint.INDEX_TS, query);
  return quotes.results.map((symbolData) => {
    symbolData.data = symbolData.data.map((v: any) => ({
      d: v.D953,
      o: Number(v.D17) || null,
      h: Number(v.D18) || null,
      l: Number(v.D19) || null,
      c: Number(v.D2) || null,
      v: Number(v.D16) || null,
    }));
    return symbolData;
  });
};

/**
 * You use the Search API to request instruments based on parameters related to static information for those instruments.
 * Parameters include exchange ID, security type, FIGI codes, performance ID, and so on.
 * Search parameters can be used individually or combined. For example, you can search for all instruments with 'Brit'
 * in their name, or find all instruments associated with a specific venue FIGI.
 * Wildcard searches are supported. Users only have access to the data they are contracted and licensed for.
 *
 * [MS-WS-SPEC] 7.5 Search]
 */
export const search = async (parameters: MSAPISearchRequest): Promise<MSAPIResults> => {
  const query = serializeToQueryParams(parameters, [
    'exchange',
    'security',
    'currency',
    'CUSIP',
    'investmentID',
    'ISIN',
    'MIC',
    'name',
    'PerfID',
    'responses',
    'rootsymbol',
    'SEDOL',
    'symbol',
    'WKN',
    'Valoren',
    'venueFIGI',
    'countryFIGI',
    'shareclassFIGI',
    'GIDInvestmentType',
    'fields',
  ]);
  const quotes = await requestMorningStar(EMSAPIEndpoint.SEARCH, query);
  return quotes.results;
};
