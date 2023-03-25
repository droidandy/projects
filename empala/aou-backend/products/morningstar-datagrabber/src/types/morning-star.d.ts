/** Exchange code in Morningstar ["Morningstar Exchange and Field Codes" v2020.1, 2 - "Morningstar Exchange Codes"] */
type MSExchangeCode = string;

/** Security ID in Morningstar ["Morningstar Exchange and Field Codes" v2020.1, 4 - "Morningstar Security Types"] */
type MSSecurityId = string | number;

type MSAPIResults = any[];

interface MSAPIResponse {
  error?: string;
  results?: MSAPIResults;
}

interface MSAPISecurityOfExchange {
  exchange: MSExchangeCode;
  security?: MSSecurityId;
}

interface MSAPIDateInterval {
  sdate?: any;
  edate?: any;
}

interface MSAPITimeInterval {
  stime?: string;
  etime?: string;
}

/** Morningstar ticker symbol. Field H1. Ex: A */
type MSAPISymbols = string | string[];

/** Morningstar Investment ID (Sec) ID. Field S3059. Ex: E0USA012JT (For Symbol A) */
type MSAPIInvestmentIDs = string | string[];

/** MS Performance ID. Field D2124. Ex: 0P0000007E (For Symbol A) */
type MSAPIPerfIDs = string | string[];

/** Morningstar instrument in the form <MSExchangeCode>.<MSSecurityId>.<symbol> Ex: 157.1.A */
type MSAPIInstrument = string;

/** Morningstar instrument or list of that instruments */
type MSAPIInstruments = MSAPIInstrument | MSAPIInstrument[];

/**
 * The object from the values of which the value of the instrument parameter is collected -
 * one or more values of the form <MSExchangeCode>.<MSSecurityId>.<symbol> Ex: 157.1.A
 */
interface MSAPIInstrumentsObject {
  exchange: MSExchangeCode;
  security: MSSecurityId;
  symbols: MSAPISymbols;
}

/**
 * The object from the values of which the value of the instrument parameter is collected -
 * one or more values of the form <MSExchangeCode>.<MSSecurityId>.<symbol> Ex: 157.1.A
 */
interface MSAPIInvestmentIDsObject {
  exchange: MSExchangeCode;
  investmentIDs: MSAPIInvestmentIDs;
}

/**
 * The object from the values of which the value of the instrument parameter is collected -
 * one or more values of the form <MSExchangeCode>.<MSSecurityId>.<symbol> Ex: 157.1.A
 */
interface MSAPIPerfIDsObject {
  perfIDs: MSAPIPerfIDs;
}

interface MSAPIExchangeInfoObject {
  exchangeInfo: MSExchangeCode;
}

interface MSAPIEodDownloadObject {
  exchange: MSExchangeCode;
  eodDownload: boolean;
}

type MSAPIPriceAndQuoteRequest = (
  MSAPIInstrumentsObject
  | MSAPISecurityOfExchange
  | MSAPIInvestmentIDsObject
  | MSAPIPerfIDsObject
  | MSAPIExchangeInfoObject
  | MSAPIEodDownloadObject
  | { instruments: MSAPIInstruments }
) & {
  fields?: string[];
  timezone?: string;
  vwap?: boolean;
};

type MSAPIPriceHistoryRequest = {
  type?: 'Bar' | 'Tick' | 'MinBar' | 'HourBar' | 'DailyBar' | 'WeeklyBar' | 'MonthlyBar';
  exchange?: MSExchangeCode;
  security?: MSSecurityId;
  symbols?: MSAPISymbols;
  interval?: number;
  ISIN?: string;
  singleDataPoint?: boolean;
  calendarDays?: number;
  tradingDays?: number;
  today?: boolean;
  listingExch?: boolean;
  symbolList?: boolean;
  fullSearch?: boolean;
  hisEODExchange?: boolean;
  numBars?: number;
  nanoseconds?: boolean;
  openClose?: boolean;
  openInterest?: boolean;
  prePost?: boolean;
  tradCond?: boolean;
  unadjusted?: boolean;
  VWAP?: boolean;
  fields?: string[];
} & MSAPIDateInterval & MSAPITimeInterval;

interface MSAPISearchRequest {
  exchange?: MSExchangeCode;
  security?: MSSecurityId;
  currency?: string;
  CUSIP?: string;
  fields?: string[];
  investmentID?: MSAPIInvestmentIDs;
  ISIN?: string;
  MIC?: string;
  name?: string;
  PerfID?: MSAPIPerfIDs;
  responses?: number;
  rootsymbol?: string;
  SEDOL?: string;
  symbol?: MSAPISymbols;
  WKN?: string;
  Valoren?: string;
  venueFIGI?: string;
  countryFIGI?: string;
  shareclassFIGI?: string;
  GIDInvestmentType?: string;
}

type SymbolOHLCV = { symbol: string } & OHLCV;
