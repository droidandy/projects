import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehicleItem = () => {
  return useStateBase('vehicleItem', actions, thunkActions);
};
