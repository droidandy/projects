import { DModelX, IDModelX, ILambda } from '@invest.wl/common';
import { IDTradeItemDTO, Injectable, TDCurrencyCode } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { DInstrumentTypeMpart, IDInstrumentTypeMpart } from '../../Instrument/mpart/D.InstrumentType.mpart';

export const DTradeModelTid = Symbol.for('DTradeModelTid');
type TDTO = IDTradeItemDTO;

export interface IDTradeModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly instrumentType: IDInstrumentTypeMpart;
  readonly amount: number;
  readonly currency: TDCurrencyCode;
}

@Injectable()
export class DTradeModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDTradeModel<DTO> {
  public instrumentType = new DInstrumentTypeMpart(() => this.dto.Instrument);

  @computed
  public get currency() {
    return this.dto.Instrument.Currency.Name;
  }

  @computed
  public get amount() {
    return this.dto.Amount;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }
}
