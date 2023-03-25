import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useFinanceCreditVehicle = () => {
  return useStateBase('financeCreditVehicle', actions, thunkActions);
};
