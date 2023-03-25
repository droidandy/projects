import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehiclesBreadCrumbsData = () => {
  return useStateBase('breadCrumbs', actions, thunkActions);
};
