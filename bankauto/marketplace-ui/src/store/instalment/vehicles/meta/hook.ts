import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useInstalmentMeta = () => {
  return useStateBase('instalmentMeta', actions, thunkActions);
};
