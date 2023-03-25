import { DModelX, IDModelX, ILambda } from '@invest.wl/common';
import { EDNotificationChannel, IDNotificationDTO, Injectable, IoC } from '@invest.wl/core';
import { action, computed, makeObservable } from 'mobx';
import { DNotificationStoreTid, IDNotificationStore } from '../D.Notification.types';

export const DNotificationModelTid = Symbol.for('DNotificationModelTid');
type TDTO = IDNotificationDTO;

export interface IDNotificationModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly createdAt: Date;
  readonly isImportant: boolean;
  remove(): void;
}

@Injectable()
export class DNotificationModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDNotificationModel<DTO> {
  private _store = IoC.get<IDNotificationStore>(DNotificationStoreTid);

  public createdAt = new Date();

  @computed
  public get isImportant() {
    return this.dto.channel === EDNotificationChannel.Important;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }

  @action.bound
  public remove() {
    this._store.remove(this);
  }
}
