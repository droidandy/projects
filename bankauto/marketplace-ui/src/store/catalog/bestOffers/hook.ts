import { useStateBase } from '../../utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehiclesBestOffers = () => {
  return useStateBase('vehiclesBestOffers', actions, thunkActions);
};
