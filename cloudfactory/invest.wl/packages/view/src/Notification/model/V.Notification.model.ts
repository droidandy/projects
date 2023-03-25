import { ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { EDNotificationType, Injectable, IoC } from '@invest.wl/core';
import { DNotificationAdapterTid, IDNotificationAdapter, IDNotificationModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import moment from 'moment';
import { VThemeStore } from '../../Theme/V.Theme.store';
import { TVThemeColor, VThemeStoreTid } from '../../Theme/V.Theme.types';

export const VNotificationModelTid = Symbol.for('VNotificationModelTid');

export interface IVNotificationModel extends IVModelX<IDNotificationModel> {
  readonly title?: string;
  readonly message: string;
  readonly closeable: boolean;
  readonly bgColor: string;
  readonly textColor: string;
  close(): void;
  closeScheduled(): void;
}

@Injectable()
export class VNotificationModel extends VModelX<IDNotificationModel> implements IVNotificationModel {
  public static colorMap: { [T in EDNotificationType]: { bg: TVThemeColor; text: TVThemeColor } } = {
    [EDNotificationType.Success]: { bg: 'positive', text: 'base' },
    [EDNotificationType.Info]: { bg: 'waiting', text: 'base' },
    [EDNotificationType.Warning]: { bg: 'accent2', text: 'base' },
    [EDNotificationType.Error]: { bg: 'negativeLight', text: 'base' },
  };

  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _adapter = IoC.get<IDNotificationAdapter>(DNotificationAdapterTid);

  private _closeTimeout: any;
  private _closeTime = moment(this.domain.createdAt).add(this._adapter.closeTimeout, 'millisecond').toDate();

  @computed
  public get title() {
    return this.domain.dto.title;
  }

  @computed
  public get message() {
    return this.domain.dto.message;
  }

  @computed
  public get closeable() {
    return this.domain.dto.closeable !== false;
  }

  @computed
  public get bgColor() {
    return this._theme.color[VNotificationModel.colorMap[this.domain.dto.type].bg];
  }

  @computed
  public get textColor() {
    return this._theme.color[VNotificationModel.colorMap[this.domain.dto.type].text];
  }

  constructor(dtoLV: ILambda<IDNotificationModel>) {
    super(dtoLV);
    makeObservable(this);
    this.closeScheduled();
  }

  public close = () => {
    clearTimeout(this._closeTimeout);
    if (!this.closeable) return;
    this.domain.remove();
  };

  public closeScheduled() {
    if (!this.closeable) return;
    const timeout = -moment().diff(this._closeTime);
    this._closeTimeout = setTimeout(() => this.close(), timeout);
  }
}
