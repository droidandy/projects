import { DModelXValue, IDModelXValue, ILambda } from '@invest.wl/common';
import { IDNotificationSettingDTO, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';

export const DNotificationSettingModelTid = Symbol.for('DNotificationSettingModelTid');
type TDTO = IDNotificationSettingDTO;

export interface IDNotificationSettingModel<DTO extends TDTO = TDTO> extends IDModelXValue<DTO> {
  importantToggle(): void;
}

@Injectable()
export class DNotificationSettingModel<DTO extends TDTO = TDTO> extends DModelXValue<DTO> implements IDNotificationSettingModel<DTO> {
  @observable private _importantShow?: boolean;

  @computed
  public get importantShow() {
    return this._importantShow ?? this.dto.importantShow;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }

  @action
  public importantToggle() {
    this._importantShow = !this.importantShow;
  }
}
