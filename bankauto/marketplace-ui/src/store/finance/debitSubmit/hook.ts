import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useDebitSubmit = () => {
  return useStateBase('debitSubmit', actions, thunkActions);
};
