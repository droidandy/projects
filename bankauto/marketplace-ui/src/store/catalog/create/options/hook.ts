import { useStateModel } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehicleCreateOptions = () => {
  return useStateModel('vehicleCreateOptions', actions, thunkActions);
};
