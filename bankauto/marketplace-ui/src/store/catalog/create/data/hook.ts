import { useStateModel, useStateSelectorObject } from 'store/utils';
import { StateModel } from 'store/types';
import { VehicleFormData } from 'types/VehicleFormType';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useVehicleCreateData = () => {
  return useStateModel('vehicleCreateData', actions, thunkActions);
};

export const useVehicleCreateDataProperties = () => {
  return useStateSelectorObject<StateModel, VehicleFormData>((state) => state.vehicleCreateData.data);
};
