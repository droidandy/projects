import { DModelX, IDModelX, ILambda } from '@invest.wl/common';
import { IDInvestIdeaInfoResponseDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';

export const DInvestIdeaModelTid = Symbol.for('DInvestIdeaModelTid');
type TDTO = IDInvestIdeaInfoResponseDTO;

export interface IDInvestIdeaModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly profit: number;
  readonly isGrow: boolean;
}

@Injectable()
export class DInvestIdeaModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDInvestIdeaModel<DTO> {
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
