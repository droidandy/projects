import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useDepositCalculator = () => {
  return useStateBase('depositCalculator', actions, thunkActions);
};
