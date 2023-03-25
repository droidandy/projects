import { useStateBase } from 'store/utils';
import * as thunkActions from './actions';
import { actions } from './reducers';

export const useComparisonVehiclesNew = () => {
  return useStateBase('comparisonVehiclesNew', actions, thunkActions);
};
