import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useInstalmentFilter = () => {
  return useStateBase('instalmentFilter', actions, thunkActions);
};
