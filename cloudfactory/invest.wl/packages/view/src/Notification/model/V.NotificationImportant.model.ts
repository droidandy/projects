import { ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { EDNotificationType, Injectable, IoC } from '@invest.wl/core';
import { IDNotificationModel } from '@invest.wl/domain';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system';
import { computed, makeObservable } from 'mobx';
import moment from 'moment';
import { IVThemeStore, TVThemeColor, VThemeStoreTid } from '../../Theme/V.Theme.types';

export const VNotificationImportantModelTid = Symbol.for('VNotificationImportantModelTid');

export interface IVNotificationImportantModel extends IVModelX<IDNotificationModel> {
  readonly appName: string;
  readonly date: string;
  readonly closeTime: Date;
  readonly title?: string;
  readonly message: string;
  readonly bgColor: string;
  readonly textColor: string;
}

@Injectable()
export class VNotificationImportantModel extends VModelX<IDNotificationModel> implements IVNotificationImportantModel {
  public static colorMap: { [T in EDNotificationType]: { bg: TVThemeColor; text: TVThemeColor } } = {
    [EDNotificationType.Success]: { bg: 'base', text: 'text' },
    [EDNotificationType.Info]: { bg: 'base', text: 'text' },
    [EDNotificationType.Warning]: { bg: 'base', text: 'text' },
    [EDNotificationType.Error]: { bg: 'base', text: 'text' },
  };

  private _theme = IoC.get<IVThemeStore>(VThemeStoreTid);
  private _cfg = IoC.get<ISConfigStore>(SConfigStoreTid);

  public closeTime = moment(this.domain.createdAt).add(5, 'second').toDate();

  @computed
  public get title() {
    return this.domain.dto.title || '';
  }

  @computed
  public get message() {
    return this.domain.dto.message;
  }

  @computed
  public get appName() {
    return this._cfg.appName;
  }

  @computed
  public get date() {
    return 'Сейчас';
  }

  @computed
  public get bgColor() {
    return this._theme.color[VNotificationImportantModel.colorMap[this.domain.dto.type].bg];
  }

  @computed
  public get textColor() {
    return this._theme.color[VNotificationImportantModel.colorMap[this.domain.dto.type].text];
  }

  constructor(dtoLV: ILambda<IDNotificationModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
