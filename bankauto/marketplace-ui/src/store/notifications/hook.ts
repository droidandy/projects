import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useNotifications = () => {
  return useStateBase('notifications', actions, thunkActions);
};
