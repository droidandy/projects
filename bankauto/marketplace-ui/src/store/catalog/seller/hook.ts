import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useSellerInfo = () => {
  return useStateBase('sellerInfo', actions, thunkActions);
};
