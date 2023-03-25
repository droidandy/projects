import { Formatter, ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { Injectable, TDDatePeriodUnit } from '@invest.wl/core';
import { IDInstrumentMarketHistoryModel } from '@invest.wl/domain';
import { action, computed, makeObservable, observable } from 'mobx';
import { IVChartLineDataItem } from '../../Chart/V.Chart.types';
import { IVInstrumentInfoMpart, VInstrumentInfoMpart } from '../mpart/V.InstrumentInfo.mpart';

export const VInstrumentMarketHistoryModelTid = Symbol.for('VInstrumentMarketHistoryModelTid');

export interface IVInstrumentMarketHistoryModel extends IVModelX<IDInstrumentMarketHistoryModel> {
  readonly instrumentInfo: IVInstrumentInfoMpart;
  readonly lineData: IVChartLineDataItem[];
  readonly pointSelected?: IVChartLineDataItem;
  readonly pointX?: string;
  readonly pointY?: string;
  pointSelect(point: IVChartLineDataItem): void;
}

@Injectable()
export class VInstrumentMarketHistoryModel extends VModelX<IDInstrumentMarketHistoryModel> implements IVInstrumentMarketHistoryModel {
  public static periodListShort: TDDatePeriodUnit[] = ['m1', 'm5', 'h1', 'D1', 'W1', 'M1'];

  public instrumentInfo = new VInstrumentInfoMpart(() => this.domain.instrumentSummary.dto.Instrument);
  @observable public pointSelected?: IVChartLineDataItem;

  @computed
  public get lineData(): IVChartLineDataItem[] {
    return this.domain.data.map((item, index) => ({
      x: new Date(item.date).getTime(), y: item.end,
    }));
  }

  @computed
  public get pointX() {
    if (!this.pointSelected) return;
    return Formatter.date(new Date(this.pointSelected.x), {
      pattern: VInstrumentMarketHistoryModel.periodListShort.includes(this.domain.period.unit) ? 'dateTime' : 'default',
    });
  }

  @computed
  public get pointY() {
    if (!this.pointSelected) return;
    return Formatter.currency(this.pointSelected.y, { precision: 10, omitZero: true, symbol: this.instrumentInfo.symbol });
  }

  constructor(dtoLV: ILambda<IDInstrumentMarketHistoryModel>) {
    super(dtoLV);
    makeObservable(this);
  }

  @action.bound
  public pointSelect(point: IVChartLineDataItem) {
    this.pointSelected = point;
  }
}
