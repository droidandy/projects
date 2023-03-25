import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehicleReview = () => {
  return useStateBase('vehicleReview', actions, thunkActions);
};
