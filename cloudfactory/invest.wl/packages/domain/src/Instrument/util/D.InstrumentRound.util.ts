// import { EDInstrumentAssetType } from '../dto';
// import { formatter } from '../../../src/util/formatter.util';
// import maxBy from 'lodash/maxBy';
// import sumBy from 'lodash/sumBy';
// import { numberIsZero } from '../../../src/util/number.util';
//
// interface IPercentageRecalcInstrumentItem {
//   assetType?: EDInstrumentAssetType;
//   percent: number;
// }
//
// export function percentageRecalc(list: IPercentageRecalcInstrumentItem[], precision: number) {
//   const total = formatter.normalizeFloat(
//     sumBy(list, (item) => item.percent),
//     precision,
//   );
//   if (!list.length || total === 100) return list;
//   const diff = formatter.normalizeFloat(100 - total, precision);
//   const listMoney = list.filter((item) => item.assetType === EDInstrumentAssetType.Money && item.percent / diff >= 5);
//   const max = maxBy(listMoney.length ? listMoney : list, (item) => item.percent);
//   if (!max) return list;
//   const maxIndex = list.indexOf(max);
//   max.percent = formatter.normalizeFloat(max.percent + diff, precision);
//   list[maxIndex] = max;
//   return list;
// }
//
// export function percentageMin(value: number, min: number = 0.01) {
//   return !numberIsZero(value) && value < min ? min : Formatter.toFixedRound(value, Formatter.morphPriceStep(min));
// }
