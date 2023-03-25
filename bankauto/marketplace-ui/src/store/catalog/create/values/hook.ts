import { useStateModel } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehicleCreateValues = () => {
  return useStateModel('vehicleCreateSellValues', actions, thunkActions);
};
