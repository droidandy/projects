import { DModelX, IDModelX, ILambda } from '@invest.wl/common';
import { EDOrderStatus, IDOrderInfoResponseDTO, IDOrderRequestCreateRequestDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable, observable } from 'mobx';

export const DOrderInfoModelTid = Symbol.for('DOrderInfoModelTid');
type TDTO = IDOrderInfoResponseDTO;

export interface IDOrderInfoModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  status: EDOrderStatus;
}

@Injectable()
export class DOrderInfoModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDOrderInfoModel<DTO> {
  @observable private _status?: EDOrderStatus;
  @computed
  public get status() {
    return this._status ?? this.dto.ExchangeStatus;
  }

  public set status(status: EDOrderStatus) {
    this._status = status;
  }

  @computed
  public get isCancelled() {
    return this.status === EDOrderStatus.Deleted;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }

  public lvSet(dtoLV: ILambda<DTO>) {
    super.lvSet(dtoLV);
    this._status = undefined;
  }

  @computed
  public get asOrderCreateDTO(): IDOrderRequestCreateRequestDTO {
    return {
      id: this.dto.id, bs: this.dto.BS, amount: this.dto.Amount,
      price: this.dto.Price, type: this.dto.Type, accountId: this.dto.AccountId,
      instrument: {
        id: this.dto.Instrument.id.id,
        classCode: this.dto.Instrument.ClassCode, secureCode: this.dto.Instrument.SecureCode,
      },
    };
  }
}
