import { Injectable, TDDatePeriodUnitBase } from '@invest.wl/core';
import { IDChartConfig } from '@invest.wl/domain';

@Injectable()
export class DChartConfig implements IDChartConfig {
  public linePeriodList: TDDatePeriodUnitBase[] = ['D1', 'W1', 'M1', 'M3', 'M6', 'Y1'];
  public candlePeriodList: TDDatePeriodUnitBase[] = ['D1', 'W1', 'M3', 'M6', 'Y1'];
}
