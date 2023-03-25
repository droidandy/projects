interface ExtRow {
  cusip: string;
  symbol: string;
  shortDescription: string;
  securityTypeCode: string;
  cmpQualCode?: string;
  secQualCode: string;
  marketCode: string;
  closingPrice: number;
  lastPriceDate: string;
  description: string;
  foreignCountry: string;
}

interface ClosePriceData {
  /* eslint-disable camelcase */
  feed: string;
  inst_id: string;
  price_close: string;
  ts_date: string;
  /* eslint-enable camelcase */
}

interface ShortInstrumentData {
  id: string;
  cusip: string;
  symbol: string;
}

type YMDDateString = string; // Format: yyyyMMdd

type ISODateString = string; // Format: yyyy-MM-dd

type MDYDateString = string; // Format: MM/dd/yyyy

/**
 * Map symbol => { inst_id, cusip } For country: USA, feed: APEX
 */
interface InstrumentsCache {
  [symbol: string]: string;
}
