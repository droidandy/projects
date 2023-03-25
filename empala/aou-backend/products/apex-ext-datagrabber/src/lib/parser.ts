import fs from 'fs';
import { parseFile } from '@fast-csv/parse';
import { ParserOptionsArgs } from '@fast-csv/parse/build/src/ParserOptions';
import { CreateInstrumentInput, ECountry, EInstrumentType } from '../types/gql-types';
import { logger } from './logger';
import * as utils from './utils';
import AError from './a-error';

export interface ParseEXT747Result {
  instruments: CreateInstrumentInput[];
  closePriceBySymbolMap: { [symbol: string]: string };
  reportDate: ISODateString;
}

const PARSE_TIMEOUT_MILLIS = 300_000;

const EXT_MARKET_CODES: { [name: string]: string } = {
  1: 'NYSE',
  2: 'AMEX',
  F: '?',
  O: 'OTC',
  Q: 'NMS',
  V: 'ARCA',
  '': '',
};

/**
 * Reads the specified EXT747 report file from the local file system, parses it and returns the obtained data.
 *
 * During parsing, we filter all instruments by the following rules:
 *  - US market
 *  - one of these exchanges: NYSE, NMS, ARCA
 *  - stocks and ETFs only
 *  - non-zero price
 *  - actual lastPriceDate(EXT files may contain outdated instruments, with last trades in 2020 and earlier)
 */
export const parseEXT747 = async (
  localFilePath: string,
  reportDate: ISODateString,
): Promise<ParseEXT747Result> => {
  if (!fs.existsSync(localFilePath)) {
    throw new AError(`Local file ${localFilePath} is missing`, 1);
  }
  const time = Date.now();
  const instruments: CreateInstrumentInput[] = [];
  const closePriceBySymbolMap: { [symbol: string]: string } = {};
  const thresholdDate: YMDDateString = utils.ISO2YMD(utils.subtractDays(reportDate, 1));
  const usedHeadersMap: any = {
    0: 'cusip',
    1: 'symbol',
    2: 'shortDescription',
    3: 'securityTypeCode',
    // 4: 'cmpQualCode', // Security Sub Type
    5: 'secQualCode', //  Security Sub Type
    12: 'marketCode', // Corresponds to theExchange the Security is listed on
    31: 'closingPrice',
    34: 'description',
    39: 'lastPriceDate',
    45: 'foreignCountry',
  };
  const headers = [...Array(65)].map((v, i) => usedHeadersMap[i]);

  const parserOptions: ParserOptionsArgs = {
    headers, delimiter: '|', quote: null, ignoreEmpty: true,
  };

  /* istanbul ignore next */
  return new Promise((resolve, reject) => {
    const timerId = setTimeout(
      () => reject(new Error(`Timeout exceeded for parsing SOD file ${localFilePath}`)),
      PARSE_TIMEOUT_MILLIS,
    );

    const resume = (err: any, result: ParseEXT747Result) => {
      clearTimeout(timerId);
      if (err) {
        return reject(err);
      }
      return resolve(result);
    };

    parseFile(localFilePath, parserOptions)
      .validate((row: any) => {
        const {
          foreignCountry,
          marketCode,
          securityTypeCode,
          secQualCode,
          closingPrice,
          lastPriceDate,
        } = row as ExtRow;
        return foreignCountry === 'US'
          && ['1', 'Q', 'V'].includes(marketCode)
          && (securityTypeCode === 'A' || securityTypeCode === 'B' || (securityTypeCode === 'C' && secQualCode === '2'))
          && thresholdDate < utils.MDY2YMD(lastPriceDate)
          && closingPrice > 0.0;
      })
      .on('error', resume)
      .on('data', (row: ExtRow) => {
        const {
          symbol, cusip, description, shortDescription, marketCode, securityTypeCode, closingPrice,
        } = row;
        instruments.push({
          country: ECountry.USA,
          symbol,
          cusip,
          description,
          exchangeName: EXT_MARKET_CODES[marketCode] || '',
          shortDescription,
          type: ['A', 'B'].includes(securityTypeCode) ? EInstrumentType.STOCK : EInstrumentType.ETF,
        });
        closePriceBySymbolMap[symbol] = closingPrice.toString().replace(/0+$/, '');
      })
      .on('end', () => {
        logger.info(`CSV parsing of ${localFilePath} completed in [${Date.now() - time} ms]`);
        resume(null, { instruments, closePriceBySymbolMap, reportDate });
      })
      .on('close', resume);
  });
};
