import { DModelX, IDModelX, ILambda } from '@invest.wl/common';
import { IDInstrumentQuoteItemDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';

export const DInstrumentQuoteModelTid = Symbol.for('DInstrumentQuoteModelTid');
type TDTO = IDInstrumentQuoteItemDTO;

export interface IDInstrumentQuoteModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  alertHas: boolean;
}

@Injectable()
export class DInstrumentQuoteModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDInstrumentQuoteModel<DTO> {
  @computed
  public get isGrow() {
    return this.dto.Change >= 0;
  }

  @computed
  public get alertHas() {
    return this.dto.HasAlert;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }
}
