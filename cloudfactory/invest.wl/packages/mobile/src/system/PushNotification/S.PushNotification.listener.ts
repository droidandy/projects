import { DisposableHolder } from '@invest.wl/common';
import { EDNotificationChannel, EDNotificationType, Inject, Injectable } from '@invest.wl/core';
import { ISNotificationStore, SNotificationStoreTid } from '@invest.wl/system';
import { Platform } from 'react-native';
import { SDeepLinkService, SDeepLinkServiceTid } from '../DeepLink/S.DeepLink.service';
import { SPushNotificationStore } from './S.PushNotification.store';
import { ISPushNotificationItem, ISPushNotificationListener, SPushNotificationStoreTid } from './S.PushNotification.types';

@Injectable()
export class SPushNotificationListener implements ISPushNotificationListener {
  /**
   * См. ./README.md
   * @param notification
   * @private
   */
  private static _iosCorrect(notification: any) {
    if (notification.message) return notification;
    notification.message = { ...notification._alert };
    return notification;
  }

  private _dh = new DisposableHolder();

  constructor(
    @Inject(SPushNotificationStoreTid) private _store: SPushNotificationStore,
    @Inject(SNotificationStoreTid) private _notificationStore: ISNotificationStore,
    @Inject(SDeepLinkServiceTid) private _deepLink: SDeepLinkService,
  ) { }

  public async init() {
    this._dh.push(this._store.notificationX.subscribe(notification => {
      if (notification) this._onNotification(notification).then();
    }));
  }

  public dispose() {
    this._dh.dispose();
  }

  /**
   * Вызывается когда:
   * - приложение активно
   * - приложение не активно
   * - пользователь тапнул по нотификации
   * @param notification
   */
  private async _onNotification(notification: ISPushNotificationItem) {
    notification = SPushNotificationListener._iosCorrect(notification);

    if (Platform.OS === 'ios') {
      try {
        if (notification.message) {
          const { body, title, front_action: frontAction } = notification.message as any;
          const fromBackground = !notification.foreground && notification.userInteraction;
          const fromForeground = notification.foreground;

          if (fromBackground) {
            await this._processFrontAction(frontAction);
          } else if (fromForeground) {
            this._notificationStore.add({
              type: EDNotificationType.Info, channel: EDNotificationChannel.Important,
              title, message: body, onPress: () => this._processFrontAction(frontAction),
            });
          }
        }
      } finally {
        notification.finish('UIBackgroundFetchResultNoData');
      }
    } else if (Platform.OS === 'android') {
      const { id, body, title, front_action: frontAction, actions } = notification as any;
      const fromBackground = !notification.foreground && notification.userInteraction && actions;
      const fromForeground = notification.foreground && id && body;

      if (fromForeground) {
        // вызовет _onNotification повторно, если пользователь тапнет
        this._notificationStore.add({
          type: EDNotificationType.Info, channel: EDNotificationChannel.Important,
          title, message: body, onPress: () => this._processFrontAction(frontAction),
        });
      } else if (fromBackground) {
        await this._processFrontAction(actions);
      } else if (frontAction) {
        await this._processFrontAction(frontAction);
      }
    }
  }

  private _processFrontAction = async (frontAction: string) => {
    await this._deepLink.handle({ frontAction });
  };
}
