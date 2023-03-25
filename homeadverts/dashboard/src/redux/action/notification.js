import { notification } from 'type';

export const notificationShowAction = payload => ({
  type: notification.NOTIFICATION_SHOW,
  payload,
});

export const notificationHideAction = ({ type: notification.NOTIFICATION_HIDE });
