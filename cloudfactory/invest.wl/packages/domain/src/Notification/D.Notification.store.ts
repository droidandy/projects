import { MapX } from '@invest.wl/common';
import { EDNotificationType, IDNotificationDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { DErrorStore, DErrorStoreTid } from '../Error/D.Error.store';
import { DErrorModel } from '../Error/model/D.Error.model';
import { DNotificationGateway, DNotificationGatewayTid } from '../Notification/D.Notification.gateway';
import { DNotificationStoreAdapterTid, IDNotificationStore, IDNotificationStoreAdapter } from './D.Notification.types';
import { DNotificationModel, DNotificationModelTid, IDNotificationModel } from './model/D.Notification.model';
import { DNotificationSettingModel, DNotificationSettingModelTid } from './model/D.NotificationSetting.model';

@Injectable()
export class DNotificationStore implements IDNotificationStore {
  public setting = new this.settingModel({ importantShow: false });

  public listX = new MapX.BaseList(
    () => this._storeAdapter.list,
    v => new this._model(v),
  );

  constructor(
    @Inject(DNotificationModelTid) private _model: Newable<typeof DNotificationModel>,
    @Inject(DNotificationStoreAdapterTid) private _storeAdapter: IDNotificationStoreAdapter,
    @Inject(DErrorStoreTid) private _errorStore: DErrorStore,
    @Inject(DNotificationGatewayTid) private gw: DNotificationGateway,
    @Inject(DNotificationSettingModelTid) private settingModel: Newable<typeof DNotificationSettingModel>,
  ) { }

  public init() {
    this._errorStore.errorX.subscribe(e => {
      if (e instanceof DErrorModel && !e.isNotified) {
        e.isNotified = true;
        this.errorAdd(e.message);
      }
    });
  }

  public add(dto: Omit<IDNotificationDTO, 'id'>) {
    return this._storeAdapter.add(dto);
  }

  public successAdd(message: string) {
    return this.add({ type: EDNotificationType.Success, message });
  }

  public infoAdd(message: string) {
    return this.add({ type: EDNotificationType.Info, message });
  }

  public warningAdd(message: string) {
    return this.add({ type: EDNotificationType.Warning, message });
  }

  public errorAdd(message: string) {
    return this.add({ type: EDNotificationType.Error, message });
  }

  public remove(item: IDNotificationModel) {
    this._storeAdapter.remove(item.dto);
  }

  public clear() {
    this._storeAdapter.clear();
  }

  public async importantToggle() {
    await this.gw.settingUpdate({ importantShow: !this.setting.importantShow });
    this.setting.importantToggle();
  }
}
