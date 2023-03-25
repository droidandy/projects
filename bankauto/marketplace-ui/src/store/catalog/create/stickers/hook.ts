import { useStateModel } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehicleCreateStickers = () => {
  return useStateModel('vehicleCreateStickers', actions, thunkActions);
};
