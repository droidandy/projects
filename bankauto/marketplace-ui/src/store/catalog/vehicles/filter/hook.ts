import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehiclesFilter = () => {
  return useStateBase('vehiclesFilter', actions, thunkActions);
};
