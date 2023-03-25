import { Formatter, ILambda, IVModelXValue, VModelXValue } from '@invest.wl/common';
import { IDTimerBgModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';

export interface IVTimerBgModel extends IVModelXValue<IDTimerBgModel>{
  readonly timeToEnd: string;
}

export class VTimerBgModel extends VModelXValue<IDTimerBgModel> implements IVTimerBgModel {
  @computed
  public get timeToEnd() {
    return Formatter.timer(this.domain.timeToEnd);
  }

  constructor(dtoLV: ILambda<IDTimerBgModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
