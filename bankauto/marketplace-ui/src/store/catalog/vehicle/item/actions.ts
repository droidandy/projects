import { VehicleNew } from '@marketplace/ui-kit/types';
import { AsyncAction } from 'types/AsyncAction';
import { getVehicle, getVehicleColors } from 'api/catalog';
import { ColorChooseItem } from 'types/VehicleChooseColor';
import { actions as vehiclesItemActions } from './reducers';

export const fetchVehicleItem = (brandAlias: string, modelAlias: string, id: string | number): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(vehiclesItemActions.setLoading(true));
    return getVehicle(brandAlias, modelAlias, id)
      .then(({ data }) => {
        dispatch(vehiclesItemActions.setVehicle({ vehicle: data, initial }));
      })
      .catch((err) => {
        dispatch(vehiclesItemActions.setError(err));
      });
  };
};

export const updateVehicleItem = (params: Partial<VehicleNew>): AsyncAction => {
  return function (dispatch, getState) {
    const { vehicle } = getState().vehicleItem;
    if (vehicle) {
      dispatch(vehiclesItemActions.setVehicle({ vehicle: { ...vehicle, ...params }, initial: false }));
    }
  };
};

export const setVehicleColorValue = (color: ColorChooseItem): AsyncAction => {
  return function (dispatch) {
    dispatch(vehiclesItemActions.setColorValue(color));
    dispatch(updateVehicleItem({ photos: color.images, color: { name: color.name, code: color.code } }));
  };
};

export const flushVehicleColorValue = (): AsyncAction => {
  return function (dispatch) {
    dispatch(vehiclesItemActions.setColorValue(null));
  };
};

export const fetchVehicleColors = (): AsyncAction => {
  return async (dispatch, getState) => {
    const { vehicle, pickedColor } = getState().vehicleItem;
    if (vehicle) {
      getVehicleColors(vehicle.id).then(({ data }) => {
        // changes order is important. value must be filled first
        const colorDetected = data.find((c) => c.name === vehicle.color.name);
        if (colorDetected && !pickedColor) {
          dispatch(setVehicleColorValue(colorDetected));
        }
        dispatch(vehiclesItemActions.setColorsData(data));
      });
    }
  };
};

export const flushVehicleColors = (): AsyncAction => {
  return function (dispatch) {
    dispatch(vehiclesItemActions.setColorsData(null));
  };
};
