import { generate } from 'shortid';
import { AsyncAction } from 'types/AsyncAction';
import { Notification, NotificationItem } from 'types/Notification';
import { actions } from './reducers';

export const notify =
  (message: Notification['message'], props?: Notification['props']): AsyncAction =>
  (dispatch) => {
    const notification: NotificationItem = {
      message,
      props,
      id: generate(),
    };
    dispatch(actions.addMessage(notification));
  };

export const notifyError =
  (error: Error | string): AsyncAction =>
  (dispatch) => {
    dispatch(notify(error instanceof Error ? error.message : error, { severity: 'error' }));
  };
