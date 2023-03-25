import { DModelXValue, IDModelXValue } from '@invest.wl/common';
import {
  EDDatePeriodEdge,
  IDDatePeriodItem,
  IoC,
  TDDatePeriodDates,
  TDDatePeriodUnit,
  TDDatePeriodUnitBase,
  TDDatePeriodUnitCustom,
  TDDatePeriodValue,
} from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import moment, { Moment, unitOfTime } from 'moment';
import { DDateConfig, DDateConfigTid } from '../D.Date.config';

export interface IDDatePeriodModel extends IDModelXValue<TDDatePeriodDates> {
  readonly unit: TDDatePeriodUnit;
  readonly dates: [Date, Date];
  readonly datesServer: { DateFrom: string; DateTo: string };
  readonly offsetServer: string;
  readonly from: Moment;
  readonly to: Moment;
  readonly isCustom: boolean;
  intervalGet(unit: unitOfTime.Diff): number;
  toString(): any;
  isEqual(period: IDDatePeriodModel): boolean;
}

export class DDatePeriodModel extends DModelXValue<TDDatePeriodDates> implements IDDatePeriodModel {
  public static CUSTOM: TDDatePeriodUnitCustom = 'custom';
  public static unit2item: { [T in TDDatePeriodUnitBase]: IDDatePeriodItem } = {
    'm1': { value: [1, 'minute'] },
    'm5': { value: [5, 'minute'] },
    'h1': { value: [1, 'hour'] },
    'D1': { value: [1, 'day'] },
    'W1': { value: [1, 'week'] },
    'M1': { value: [1, 'month'] },
    'M3': { value: [3, 'month'] },
    'M6': { value: [6, 'month'] },
    'Y1': { value: [1, 'year'] },
    'Y3': { value: [3, 'year'] },
  };

  public static unitToDates(unit: TDDatePeriodUnitBase, dateTo?: Date | Moment): [Moment, Moment] {
    const item = DDatePeriodModel.unit2item[unit];
    const to = moment(dateTo).endOf('day');
    const from = moment(to)
      .add(1, 'millisecond')
      .subtract(...item.value);
    return [from, to];
  }

  public static fromPeriod(period: IDDatePeriodModel) {
    const { from, to } = period;
    return new DDatePeriodModel([moment(from), moment(to.isBefore(from) ? from : to)]);
  }

  private _const = IoC.get<DDateConfig>(DDateConfigTid);

  private readonly _unit: TDDatePeriodUnit;

  @computed
  public get unit() {
    return this._unit;
  }

  public set unit(value) {
    if (value === 'custom') throw new Error('cant change unit to custom');
    this.lvSet(DDatePeriodModel.unitToDates(value));
  }

  @computed
  public get dates() {
    return this.dto.map(m => m.toDate()) as [Date, Date];
  }

  @computed
  public get datesServer() {
    // TODO: not good
    return {
      DateFrom: this.from.format('YYYY-MM-DD') + 'T00:00:00' + this._const.serverOffset,
      DateTo: this.to.format('YYYY-MM-DD') + 'T23:59:59' + this._const.serverOffset,
    };
  }

  @computed
  public get offsetServer() {
    return this._const.serverOffset;
  }

  @computed
  public get from() {
    return this.dto[EDDatePeriodEdge.Start];
  }

  public set from(value) {
    if (!this.isCustom) throw new Error('cant change period of unit');
    this.lvSet([moment(value.toDate().getTime()).startOf('day'), this.dto[EDDatePeriodEdge.End]]);
  }

  @computed
  public get to() {
    return this.dto[EDDatePeriodEdge.End];
  }

  public set to(value) {
    if (!this.isCustom) throw new Error('cant change period of unit');
    this.lvSet([this.dto[EDDatePeriodEdge.Start], moment(value.toDate().getTime()).endOf('day')]);
  }

  constructor(value: TDDatePeriodValue) {
    super(Array.isArray(value) ? value : DDatePeriodModel.unitToDates(value));
    this._unit = Array.isArray(value) ? DDatePeriodModel.CUSTOM : value;
    makeObservable(this);
  }

  @computed
  public get isCustom() {
    return this._unit === DDatePeriodModel.CUSTOM;
  }

  public intervalGet(unit: unitOfTime.Diff) {
    const [start, end] = this.dto.map(p => p.clone());
    return end.endOf(unit).add(1, 'millisecond').diff(start.startOf(unit), unit);
  }

  public toString() {
    return this.dto.map(d => d.toISOString()).join(' ');
  }

  public isEqual(period: IDDatePeriodModel) {
    return this.toString() === period.toString();
  }
}
