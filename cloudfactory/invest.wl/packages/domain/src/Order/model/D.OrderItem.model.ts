import { DModelX, IDModelX, ILambda } from '@invest.wl/common';
import { EDOrderStatus, IDOrderItemDTO, IDOrderRequestCreateRequestDTO, Injectable, TDCurrencyCode } from '@invest.wl/core';
import { computed, makeObservable, observable } from 'mobx';
import { DInstrumentTypeMpart, IDInstrumentTypeMpart } from '../../Instrument/mpart/D.InstrumentType.mpart';

export const DOrderItemModelTid = Symbol.for('DOrderItemModelTid');
type TDTO = IDOrderItemDTO;

export interface IDOrderItemModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly instrumentType: IDInstrumentTypeMpart;
  status: EDOrderStatus;
  readonly currency: TDCurrencyCode;
  readonly isCancelled: boolean;
  readonly isCancelable: boolean;
  readonly asOrderCreateDTO: IDOrderRequestCreateRequestDTO;
}

@Injectable()
export class DOrderItemModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDOrderItemModel<DTO> {
  public static cancelableStatus = [EDOrderStatus.NotSent, EDOrderStatus.New, EDOrderStatus.ReducedPartial];
  public instrumentType = new DInstrumentTypeMpart(() => this.dto.Instrument);

  @observable private _status?: EDOrderStatus;
  @computed
  public get status() {
    return this._status ?? this.dto.Status;
  }

  public set status(status: EDOrderStatus) {
    this._status = status;
  }

  @computed
  public get currency() {
    return this.dto.Instrument.Currency.Name;
  }

  @computed
  public get isCancelled() {
    return this.status === EDOrderStatus.Deleted;
  }

  @computed
  public get isCancelable() {
    return DOrderItemModel.cancelableStatus.includes(this.status);
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
      price: this.dto.Price, type: this.dto.Type, accountId: this.dto.Account.id,
      instrument: {
        id: this.dto.Instrument.id.id,
        classCode: this.dto.Instrument.ClassCode, secureCode: this.dto.Instrument.SecureCode,
      },
    };
  }
}
