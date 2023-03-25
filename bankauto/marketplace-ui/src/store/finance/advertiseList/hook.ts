import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useAdvertiseList = () => {
  return useStateBase('advertiseList', actions, thunkActions);
};
