import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import {
  setFilterData,
  clearFilterData,
  fetchDataAction,
  fetchOptionsAction,
  setValuesAction,
  setContactsAction,
  createVehicleTradeInAction,
  createVehicleSellExtAction,
  setScenario,
  createVehicleSellAction,
  setValuesByVehicle,
} from './actions';

export const useVehicleCreateState = () => {
  return useStateBase('vehicleCreate', actions, {
    setFilterData,
    clearFilterData,
    fetchDataAction,
    fetchOptionsAction,
    setValuesAction,
    setContactsAction,
    createVehicleTradeInAction,
    createVehicleSellExtAction,
    setScenario,
    createVehicleSellAction,
    setValuesByVehicle,
  });
};
