import { DModelX, IDModelX, ILambda, lambdaResolve } from '@invest.wl/common';
import { EDCurrencyCode, IDInstrumentMarketHistoryItemDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { IDDatePeriodModel } from '../../Date/model/D.DatePeriod.model';
import { IDInstrumentSummaryModel } from './D.InstrumentSummary.model';

export const DInstrumentMarketHistoryModelTid = Symbol.for('DInstrumentMarketHistoryModelTid');

type TDTO = IDInstrumentMarketHistoryItemDTO;

export interface IDInstrumentMarketHistoryModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly data: IDInstrumentMarketHistoryDataItem[];
  readonly currency: EDCurrencyCode;
  readonly priceStep: number;
  readonly period: IDDatePeriodModel;
  readonly instrumentSummary?: IDInstrumentSummaryModel;
}

export interface IDInstrumentMarketHistoryDataItem {
  date: Date;
  start?: number;
  highest?: number;
  lowest?: number;
  end: number;
  volume?: number;
}

export interface IDInstrumentMarketHistoryModelProps {
  period: ILambda<IDDatePeriodModel>;
  instrumentSummary: ILambda<IDInstrumentSummaryModel | undefined>;
}

@Injectable()
export class DInstrumentMarketHistoryModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDInstrumentMarketHistoryModel<DTO> {
  @computed
  public get data() {
    const series = this.dto.Series[0];
    if (!series) return [];
    const timeIndex = series.Columns.indexOf('time');
    const oIndex = series.Columns.indexOf('o');
    const hIndex = series.Columns.indexOf('h');
    const lIndex = series.Columns.indexOf('l');
    const cIndex = series.Columns.indexOf('c');
    const vIndex = series.Columns.indexOf('v');

    return series.Values.map(item => ({
      date: new Date(item[timeIndex]),
      start: parseFloat(item[oIndex] as string),
      highest: parseFloat(item[hIndex] as string),
      lowest: parseFloat(item[lIndex] as string),
      end: parseFloat(item[cIndex] as string),
      volume: parseFloat(item[vIndex] as string),
    } as IDInstrumentMarketHistoryDataItem));
  }

  @computed
  public get currency() {
    return this.instrumentSummary?.dto.Instrument.Currency.Name as EDCurrencyCode;
  }

  @computed
  public get priceStep() {
    return this.instrumentSummary?.dto.Instrument.PriceStep || 0;
  }

  @computed
  public get period() {
    return lambdaResolve(this._props.period);
  }

  @computed
  public get instrumentSummary() {
    return lambdaResolve(this._props.instrumentSummary);
  }

  constructor(dtoLV: ILambda<DTO>, private _props: IDInstrumentMarketHistoryModelProps) {
    super(dtoLV);
    makeObservable(this);
  }
}
