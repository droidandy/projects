import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehiclesMeta = () => {
  return useStateBase('vehiclesMeta', actions, thunkActions);
};
