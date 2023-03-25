import { TDDatePeriodUnitBase } from '@invest.wl/core';

export const DChartConfigTid = Symbol.for('DChartConfigTid');

export interface IDChartConfig {
  linePeriodList: TDDatePeriodUnitBase[];
  candlePeriodList: TDDatePeriodUnitBase[];
}
