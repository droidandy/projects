import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useFinanceCreditStandalone = () => {
  return useStateBase('financeCreditStandalone', actions, thunkActions);
};
