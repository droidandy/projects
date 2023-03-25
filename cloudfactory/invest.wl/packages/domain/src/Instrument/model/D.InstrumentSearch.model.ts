import { DModelX, IDModelX, ILambda } from '@invest.wl/common';
import { IDInstrumentSearchItemDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';

export const DInstrumentSearchModelTid = Symbol.for('DInstrumentSearchModelTid');
type TDTO = IDInstrumentSearchItemDTO;

export interface IDInstrumentSearchModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  alertHas: boolean;
}

@Injectable()
export class DInstrumentSearchModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDInstrumentSearchModel<DTO> {
  @computed
  public get isGrow() {
    return this.dto.Change >= 0;
  }

  @computed
  public get alertHas() {
    return false;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }
}
