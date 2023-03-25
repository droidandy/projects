import * as _ from 'lodash';
import config from 'config';
import { EInstrumentType } from './types/gql-types';

export const SYMBOLS_IN_REQUEST = Number(config.get('morningStar.quotas.symbolsInRequest'));

export const { DEBUG_MODE } = process.env;

export const TESTING_MODE = process.env.NODE_ENV === 'test';

/**
 * Map of Exchange Names (as they are specified in the field instruments.exchange.name) to MorningStar exchange code
 * ["Morningstar Exchange and Field Codes" v2020.1, part 2 "Morningstar Exchange Codes"]
 */
const exchangeDict: Record<string, MSExchangeCode> = {
  AMEX: '088', // "EOD - Americas Exchanges"
  NYSE: '001',
  ARCA: '016', // "NYSE Arca" // TODO clarify: there is some more: 071 / NYSE ARCA Bonds
  NMS: '157', // "Nasdaq Basic"
};
const exchangeDictInverted = _.invert(exchangeDict);

/**
 * Returns MorningStar exchange code by Exchange Name
 */
export const getMSExchangeCode = (exchangeName: string): MSExchangeCode => exchangeDict[exchangeName];

/**
 * Returns Exchange Name by MorningStar exchange code
 */
export const getExchangeName = (exchange: MSExchangeCode): string => exchangeDictInverted[exchange];

/**
 * Map of Instrument Types (as they are specified in enum instruments.e_inst_type) to MorningStar Security ID
 * ["Morningstar Exchange and Field Codes" v2020.1, part 4 "Morningstar Security Types"]
 */
const instrumentTypeDict: Record<EInstrumentType, MSSecurityId> = {
  STOCK: 1, // MS: Stocks (and some legacy warrants)
  ETF: 8, // MS: Mutual funds / ETFs
};
const instrumentTypeDictInverted = _.invert(instrumentTypeDict);

/**
 * Returns the MorningStar Security ID by the Instrument Type
 */
export const getMSSecurityId = (instrumentType: EInstrumentType): MSSecurityId => instrumentTypeDict[instrumentType];

/**
 * Returns the Instrument Type by MorningStar Security ID
 */
export const getInstrumentType = (security: MSSecurityId): EInstrumentType => instrumentTypeDictInverted[security] as EInstrumentType;

/**
 * Only security = 1 can be specified in the Symbol Guide request
 * For all returned instruments, the field H3 = 1 ("Morningstar security type" = "Stocks (and some legacy warrants)")
 * In this case, in the field S1735 ("Global ID investment type") the real name of the instrument type is received,
 * which may differ from "Stocks"
 * Thus, the real type of the tool must be obtained from the S1735 field.
 * The dictionary below is used to get "Morningstar security type" (type MSSecurityId)
 * by value "Global ID investment type"
 */
type CurrentlyUsed = boolean;
const msGlobalIdInvestmentTypeDict: Record<string, [MSSecurityId, CurrentlyUsed]> = {
  ETF: [8, true],
  Equity: [1, true],
  // The "Global ID Investment Types" below are not currently used by us
  'Equity-Right': [0, false],
  'Closed End Fund': [0, false],
  Debt: [0, false],
  'Depository-Receipt': [0, false],
  ETN: [0, false],
  'Preferred Stock': [0, false],
  'Structured Product': [0, false],
  Test: [0, false],
  Unit: [0, false],
  Warrant: [0, false],
};

/**
 * Returns the "Morningstar security type" by Morningstar "Global ID investment type"
 */
export const getMSSecurityIdByGlobalIdInvestmentType = (msInvestmentType: string): MSSecurityId => {
  const [msSecurityId, currentlyUsed] = msGlobalIdInvestmentTypeDict[msInvestmentType] || [];
  return (currentlyUsed && msSecurityId) || 0;
};

/*
 List of names of exchanges (as they are specified in the field instruments.exchange.name)
 for which we request data from MorningStar
  */
export const EXCHANGES_USED = ['NMS']; // NMS == Nasdaq Basic
