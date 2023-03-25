import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehiclesList = () => {
  return useStateBase('vehiclesList', actions, thunkActions);
};
