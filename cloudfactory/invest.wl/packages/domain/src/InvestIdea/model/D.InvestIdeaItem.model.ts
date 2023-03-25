import { DModelX, IDModelX, ILambda } from '@invest.wl/common';
import { IDInvestIdeaItemDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';

export const DInvestIdeaItemModelTid = Symbol.for('DInvestIdeaItemModelTid');
type TDTO = IDInvestIdeaItemDTO;

export interface IDInvestIdeaItemModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly profit: number;
  readonly isGrow: boolean;
}

@Injectable()
export class DInvestIdeaItemModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDInvestIdeaItemModel<DTO> {
  @computed
  public get profit() {
    return this.dto.Profit ?? 0;
  }

  @computed
  public get isGrow() {
    return this.profit >= 0;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }
}
