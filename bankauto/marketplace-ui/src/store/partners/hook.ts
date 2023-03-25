import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const usePartners = () => {
  return useStateBase('dealerPartners', actions, thunkActions);
};
