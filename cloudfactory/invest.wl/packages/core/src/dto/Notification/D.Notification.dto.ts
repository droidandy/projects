import { TModelId, TObject } from '../../types';

export enum EDNotificationChannel {
  Main = 0,
  Important,
}

export enum EDNotificationType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export interface IDNotificationDTO {
  id: TModelId;
  type: EDNotificationType;
  title?: string;
  message: string;
  channel?: EDNotificationChannel;
  // число показываемое вместе с уведомлением
  badge?: number;
  // название \ ссылка на звук во время показа
  sound?: string;
  // данные которые могут понадобиться во время обработки
  data?: TObject;
  closeable?: boolean;
  onPress?(): void;
}

export interface IDNotificationSettingDTO {
  // показывать или нет ВАЖНЫЕ события (pushNotification for mobile, NotificationApi for browser)
  importantShow: boolean;
}
