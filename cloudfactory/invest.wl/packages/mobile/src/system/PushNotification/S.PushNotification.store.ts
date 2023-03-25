import { EventX } from '@invest.wl/common';
import { EDStorageLocalKey, Inject, Injectable } from '@invest.wl/core';
import {
  ISAuthStore,
  ISConfigStore,
  ISErrorService,
  ISStorageLocalService,
  SAuthStoreTid,
  SConfigStoreTid,
  SErrorServiceTid,
  SStorageLocalServiceTid,
  STransportPushNotificationService,
  STransportPushNotificationServiceTid,
} from '@invest.wl/system';
import { action, makeObservable, observable, reaction, runInAction } from 'mobx';
import { Platform } from 'react-native';
import Push from 'react-native-push-notification';
import { ISPushNotificationItem, ISPushNotificationStore } from './S.PushNotification.types';

@Injectable()
export class SPushNotificationStore implements ISPushNotificationStore {
  @observable public isShow = false;
  @observable public deviceToken?: string;
  public notificationX = new EventX<ISPushNotificationItem>({ fireOnSubscribe: true });

  constructor(
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
    @Inject(SStorageLocalServiceTid) private _slService: ISStorageLocalService,
    @Inject(STransportPushNotificationServiceTid) private _tp: STransportPushNotificationService,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) {
    makeObservable(this);
    reaction(() => this._authStore.authenticated && this._cfg.isSystemLoaded,
      (ready) => ready && this.refresh());
  }

  public async init() {
    Push.configure({
      onRegister: this._onRegister,
      onNotification: this._onNotification,
      // @ts-ignore
      senderID: this._cfg.notificationSenderIdAndroid,
    });
    Push.popInitialNotification(notification => {
      // приложение стартует по нажатию на пуш в системе
      if (notification) {
        notification.userInteraction = true;
        this._onNotification(notification);
      }
    });
  }

  @action.bound
  public async isShowSet(isShow: boolean) {
    try {
      if (!this.deviceToken) throw new Error('Отсутствует device token');
      this.isShow = isShow;
      await this._slService.set(EDStorageLocalKey.NotificationImportantShow, isShow.toString());
      await this._tp[isShow ? 'Link' : 'Unlink']({
        device_id: this.deviceToken,
        device_product: Platform.OS === 'android' ? this._cfg.notificationDeviceProductAndroid : this._cfg.notificationDeviceProductIos,
      });
    } catch (e: any) {
      throw this._errorService.httpHandle({
        ...e, fn: `${this.constructor.name}::${__FUNCTION__}`,
        message: `Ошибка при изменении настроек. ${e.message || ''}`,
      });
    }
  };

  @action.bound
  public async refresh() {
    const isPushNotificationShow = await this._slService.get(EDStorageLocalKey.NotificationImportantShow) === 'true';
    runInAction(() => this.isShow = isPushNotificationShow);

    // а нужно ли это делать?
    if (this.deviceToken) {
      try {
        await this._tp[this.isShow ? 'Link' : 'Unlink']({
          device_id: this.deviceToken,
          device_product: Platform.OS === 'android' ? this._cfg.notificationDeviceProductAndroid : this._cfg.notificationDeviceProductIos,
        });
      } catch (e: any) {
        this._errorService.httpHandle({
          ...e, fn: `${this.constructor.name}::${__FUNCTION__}`,
          message: `Ошибка при изменении настроек . ${e.message || ''}`,
        });
      }
    }
  }

  @action.bound
  private _onRegister(token: { os: string; token: string }) {
    this.deviceToken = token.token;
  }

  @action.bound
  private _onNotification(notification: ISPushNotificationItem) {
    this.notificationX.emit(notification);
  }
}
