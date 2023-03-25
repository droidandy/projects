import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useBrandData = () => {
  return useStateBase('brand', actions, thunkActions);
};
