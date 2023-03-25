interface ShortInstrumentData {
  id: string;
  cusip: string;
  symbol: string;
  exchange: { name: string };
  type: string;
  country: string;
}

/**
 * Data of the instrument for which historical price data is to be loaded
 */
interface InstrumentToProcess {
  instrument: MSAPIInstrument;
  type: string;
  id: string;
  sdate: any;
  edate: any;
}

/**
 * Map - <Instrument> => <Instrument ID>, <Last Price Date>
 */
interface InstrumentsMap {
  [instrument: string]: InstrumentToProcess;
}

interface OHLCV {
  o: number | null;
  h: number | null;
  l: number | null;
  c: number | null;
  v: number | null;
  d?: string | null; // date | date+time
}

interface StockPricesDaily {
  /* eslint-disable camelcase */
  ts_date: string;
  inst_id: string;
  feed: string;
  price_open: string;
  price_high: string;
  price_low: string;
  price_close: string;
  /* eslint-enable camelcase */
}
