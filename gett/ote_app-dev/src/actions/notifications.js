import { createTypes } from 'redux-compose-reducer';
import { notifications } from 'api';

const TYPES = createTypes('notifications', [
  'getNotifications',
  'markAsRead'
]);

export const markAsRead = ids => (dispatch) => {
  dispatch({ type: TYPES.markAsRead, ids });
};

export const getNotifications = () => dispatch => (
  notifications.getRecent()
    .then((res) => {
      dispatch({ type: TYPES.getNotifications, data: res.data });

      return res.data;
    })
);
