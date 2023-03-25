import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useInstalmentList = () => {
  return useStateBase('instalmentList', actions, thunkActions);
};
