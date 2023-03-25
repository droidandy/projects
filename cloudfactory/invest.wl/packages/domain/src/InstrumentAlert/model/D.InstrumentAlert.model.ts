import { DModelX, IDModelX, ILambda, subtract } from '@invest.wl/common';
import { EDInstrumentAlertStatus, IDInstrumentAlertItemDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable, observable } from 'mobx';
import { DInstrumentTypeMpart, IDInstrumentTypeMpart } from '../../Instrument/mpart/D.InstrumentType.mpart';

export const DInstrumentAlertModelTid = Symbol.for('DInstrumentAlertModelTid');
type TDTO = IDInstrumentAlertItemDTO;

export interface IDInstrumentAlertModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly instrumentType: IDInstrumentTypeMpart;
  status: EDInstrumentAlertStatus;
  readonly completePercent: number;
  readonly percentToTargetPrice: number;
  readonly priceStep: number;
  readonly isGrow: boolean;
  readonly isCompleted: boolean;
}

@Injectable()
export class DInstrumentAlertModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDInstrumentAlertModel<DTO> {
  public instrumentType = new DInstrumentTypeMpart(() => this.dto.Instrument);
  @observable private _status?: EDInstrumentAlertStatus;

  @computed
  public get status() {
    return this._status ?? this.dto.Status;
  }

  public set status(status: EDInstrumentAlertStatus) {
    this._status = status;
  }

  @computed
  public get isCompleted() {
    return this.status === EDInstrumentAlertStatus.Completed || this.status === EDInstrumentAlertStatus.ExecutedAndViewed;
  }

  @computed
  public get isGrow() {
    return this.dto.TargetPrice >= this.dto.StartPrice;
  }

  @computed
  public get completePercent() {
    return subtract(100, this.percentToTargetPrice);
  }

  @computed
  public get priceStep() {
    return this.dto.Instrument.PriceStep;
  }

  @computed
  public get percentToTargetPrice() {
    return Math.abs(this.dto.PercentToTargetPrice);
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }

  public lvSet(dtoLV: ILambda<DTO>) {
    super.lvSet(dtoLV);
    this._status = undefined;
  }
}
