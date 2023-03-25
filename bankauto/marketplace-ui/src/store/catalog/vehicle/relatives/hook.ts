import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehicleRelatives = () => {
  return useStateBase('vehicleRelatives', actions, thunkActions);
};
