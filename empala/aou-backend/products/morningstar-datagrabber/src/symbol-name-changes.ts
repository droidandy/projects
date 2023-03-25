/* eslint-disable no-await-in-loop */
import './init/init-config';
import * as msApi from './morningstar-api';
import { EMSAPICorpActionRT } from './morningstar-enums';
import { getExchangeName } from './constants';
import { InstrumentNameChangeInput } from './types/gql-types';

interface NameChangeItem {
  symbol: string; // "ZVO"
  exchangeid: string; // "157"
  type: string; // "1"
  data: {
    name: string; // "157.1.BPI"
    date: string; // "15-04-2019"
  }[];
}

type DateIndex = number; // YYYYMMDD
type OldSymbol = string;
type NewSymbol = string;

const getSymbol = (exchangeSecTypeSymbol: string) => exchangeSecTypeSymbol.split('.')[2];
const getDateIndex = (dmy: string): DateIndex => Number(dmy.replace(/^(\d\d)-(\d\d)-(\d{4})$/, '$3$2$1'));

/**
 * Returns the renaming information for instruments from MorningStar
 */
export const getSymbolNameChanges = async (statistics?: any): Promise<InstrumentNameChangeInput[]> => {
  const nameChangeCache: any = {};

  // Adds a new piece of data to the cache of renaming instruments
  const fillRenMap = (renArr: NameChangeItem[]) => {
    renArr.forEach(({ symbol, data }) => {
      data.forEach(({ name: n, date: d }) => {
        const oldSymbol = getSymbol(n);
        const from = getDateIndex(d);
        if (!nameChangeCache[oldSymbol]) {
          nameChangeCache[oldSymbol] = [[symbol, from]];
        } else {
          const existedArray = nameChangeCache[oldSymbol];
          if (!existedArray.some(([s, f]: any) => (s === symbol && f === from))) {
            existedArray.push([symbol, from]);
          }
        }
      });
    });
  };

  /*
    We get all the information about the renaming of instruments for all the available time.
    The earliest data came from MS for 2005. To be sure, we request from 2005, from 2015 and from previous year
   */
  // const exchange: MSExchangeCode = '157';
  const exchange: MSExchangeCode = '157';
  const exchangeName = getExchangeName(exchange);
  for (const year of [2005, 2015, (new Date().getFullYear()) - 1]) {
    const response = await msApi.corporateActions({
      exchange,
      requestType: EMSAPICorpActionRT.NAME_CHANGES,
      sdate: `01-01-${year}`,
    });
    fillRenMap(response);
  }

  // There are a small number of cases when more than one old name corresponds to one old name.
  // We delete them.
  const multipleNameChanges: any = {}; // Information about multiple name changes. For statistics
  const singleNameChanges: [DateIndex, OldSymbol, NewSymbol][] = [];
  Object.entries(nameChangeCache).forEach(([oldSymbol, v]: any) => {
    if (v.length > 1) {
      multipleNameChanges[oldSymbol] = v;
      return;
    }
    const [newSymbol, dateIndex] = v[0];
    if (oldSymbol !== newSymbol) {
      singleNameChanges.push([dateIndex, oldSymbol, newSymbol]);
    }
  });

  singleNameChanges.sort(([a], [b]) => a - b);

  // Transforming the renaming chains: leaving only the last value of the symbol name
  const lastNameChanges: { [oldSymbol: OldSymbol]: NewSymbol } = {};
  singleNameChanges.forEach(([, oldSymbol, newSymbol]) => {
    // situation when the renaming of the same symbol has already been encountered:
    // AA -> BB ... AA -> CC (this change)
    // is solved automatically (BB will be overwritten by value CC)
    lastNameChanges[oldSymbol] = newSymbol;
    // If there is an entry where the new name is equal to the just added old name,
    // then we replace the new name in it with the current one - the most recent.
    // F.e: AA -> BB ... BB -> CC  We get two records: AA -> CC, BB -> CC
    Object.entries(lastNameChanges).forEach(([o, n]) => {
      if (n === oldSymbol) {
        lastNameChanges[o] = newSymbol;
      }
    });
  });
  if (statistics) {
    statistics.multipleNameChanges = multipleNameChanges;
    statistics.nameChangeCache = nameChangeCache;
  }
  return Object.entries(lastNameChanges).map(([oldSymbol, newSymbol]) => ({ oldSymbol, newSymbol, exchangeName }));
};
