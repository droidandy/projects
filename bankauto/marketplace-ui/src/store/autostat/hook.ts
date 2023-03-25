import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useAutostat = () => {
  return useStateBase('autostat', actions, thunkActions);
};
