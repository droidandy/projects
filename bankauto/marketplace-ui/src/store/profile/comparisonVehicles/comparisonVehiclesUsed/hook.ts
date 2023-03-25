import { useStateBase } from 'store/utils';
import * as thunkActions from './actions';
import { actions } from './reducers';

export const useComparisonVehiclesUsed = () => {
  return useStateBase('comparisonVehiclesUsed', actions, thunkActions);
};
