import { EDInstrumentMarketHistoryGap, Injectable } from '@invest.wl/core';
import moment from 'moment';
import { IDDatePeriodModel } from '../Date/model/D.DatePeriod.model';

export const DInstrumentServiceTid = Symbol.for('DInstrumentService');

@Injectable()
export class DInstrumentService {
  constructor(
    // @Inject(DInstrumentStoreTid) private _store: DInstrumentStore,
  ) { }

  public period2HistoryGap(period: IDDatePeriodModel) {
    let gap: EDInstrumentMarketHistoryGap;
    switch (period.unit) {
      case 'D1':
        gap = EDInstrumentMarketHistoryGap.Minute5;
        break;
      case 'W1':
      case 'M1':
        gap = EDInstrumentMarketHistoryGap.Hour1;
        break;
      case 'M3':
      case 'M6':
      case 'Y1':
        gap = EDInstrumentMarketHistoryGap.Day1;
        break;
      default: {
        const [from, to] = period.dto;
        const diffToNow = moment().diff(to, 'days');
        const diff = to.diff(from, 'days');

        if ((diffToNow > 1825 && diff >= 7) || diff > 1825) gap = EDInstrumentMarketHistoryGap.Week1;
        else if (diffToNow > 90 || diff > 30) gap = EDInstrumentMarketHistoryGap.Day1;
        else if (diffToNow > 5 || diff > 1) gap = EDInstrumentMarketHistoryGap.Hour1;
        else gap = EDInstrumentMarketHistoryGap.Minute5;
      }
    }
    return gap;
  }
}
