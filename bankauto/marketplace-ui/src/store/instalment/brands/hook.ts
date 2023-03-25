import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useInstalmentBrands = () => {
  return useStateBase('instalmentBrands', actions, thunkActions);
};
