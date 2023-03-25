import { Formatter, ILambda, IVModelXValue, VModelXValue } from '@invest.wl/common';
import { TDDatePeriodUnit } from '@invest.wl/core';
import { IDDatePeriodModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';

interface IVDatePeriodItem {
  abbr: string;
  name: string;
}

export interface IVDatePeriodModel extends IVModelXValue<IDDatePeriodModel> {
  readonly abbr: string;
  readonly name: string;
  readonly value: string;
}

export class VDatePeriodModel extends VModelXValue<IDDatePeriodModel> implements IVDatePeriodModel {
  public static unit2item: { [T in TDDatePeriodUnit]: IVDatePeriodItem } = {
    'custom': { abbr: 'Выбрать', name: 'За выбранный промежуток' },
    'm1': { abbr: '1мин', name: 'За минуту' },
    'm5': { abbr: '5мин', name: 'За 5 минут' },
    'h1': { abbr: '1Ч', name: 'За час' },
    'D1': { abbr: '1Д', name: 'За день' },
    'W1': { abbr: '1Н', name: 'За неделю' },
    'M1': { abbr: '1М', name: 'За месяц' },
    'M3': { abbr: '3М', name: 'За три месяца' },
    'M6': { abbr: '6М', name: 'За пол года' },
    'Y1': { abbr: '1Г', name: 'За год' },
    'Y3': { abbr: '3Г', name: 'За три года' },
  };

  @computed
  public get abbr() {
    return VDatePeriodModel.unit2item[this.domain.unit].abbr;
  }

  @computed
  public get name() {
    return VDatePeriodModel.unit2item[this.domain.unit].name;
  }

  @computed
  public get value() {
    return `${Formatter.date(this.domain.dto[0])} - ${Formatter.date(this.domain.dto[1])}`;
  }

  constructor(dtoLV: ILambda<IDDatePeriodModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
