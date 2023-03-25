import { EventX } from '@invest.wl/common';
import { ReceivedNotification } from 'react-native-push-notification';

export const SPushNotificationStoreTid = Symbol.for('SPushNotificationStoreTid');
export const SPushNotificationListenerTid = Symbol.for('SPushNotificationServiceTid');

export interface ISPushNotificationStore {
  readonly notificationX: EventX<ISPushNotificationItem>;
  readonly isShow: boolean;
  readonly deviceToken?: string;
  init(): Promise<void>;
  isShowSet(isShow: boolean): Promise<void>;
  refresh(): Promise<void>;
}

export type ISPushNotificationItem = Omit<ReceivedNotification, 'userInfo'>;

export interface ISPushNotificationListener {
  init(): Promise<void>;
}
