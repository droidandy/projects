import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useDebitCards = () => {
  return useStateBase('debitCards', actions, thunkActions);
};
