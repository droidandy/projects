import { AsyncAction } from 'types/AsyncAction';
import { VehicleFormSellValues } from 'types/VehicleFormType';
import { initialState } from 'store/initial-state';
import { actions as vehiclesCreateValuesActions } from './reducers';

export const setVehicleCreateValues = (
  values: VehicleFormSellValues,
  setInitial?: boolean | null,
): AsyncAction<Promise<VehicleFormSellValues>> => {
  return async (dispatch, getState, { initial }) => {
    await dispatch(
      vehiclesCreateValuesActions.setValues({
        values,
        initial: typeof setInitial !== 'undefined' ? setInitial : initial,
      }),
    );
    return values;
  };
};

export const updateVehicleCreateValues = (
  values: Partial<VehicleFormSellValues>,
  setInitial?: boolean | null,
): AsyncAction<Promise<VehicleFormSellValues>> => {
  return async (dispatch, getState, { initial }) => {
    const {
      vehicleCreateSellValues: { values: valuesLast },
    } = getState();
    const newValues = { ...valuesLast, ...values };
    await dispatch(
      vehiclesCreateValuesActions.setValues({
        values: newValues,
        initial: typeof setInitial !== 'undefined' ? setInitial : initial,
      }),
    );
    return newValues;
  };
};

export const clearVehicleCreateValues = (): AsyncAction => {
  return async (dispatch) => {
    const { values } = initialState.vehicleCreateSellValues;
    dispatch(
      vehiclesCreateValuesActions.setValues({
        values,
        initial: null,
      }),
    );
  };
};
