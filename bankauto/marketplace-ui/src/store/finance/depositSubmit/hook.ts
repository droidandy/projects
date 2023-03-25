import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useDepositSubmit = () => {
  return useStateBase('depositSubmit', actions, thunkActions);
};
