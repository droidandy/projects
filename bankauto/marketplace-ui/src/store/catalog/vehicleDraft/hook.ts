import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehicleDraftData = () => {
  return useStateBase('vehicleDraftData', actions, thunkActions);
};
