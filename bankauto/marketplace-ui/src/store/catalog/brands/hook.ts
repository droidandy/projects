import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehiclesBrands = () => {
  return useStateBase('brandsNew', actions, thunkActions);
};
