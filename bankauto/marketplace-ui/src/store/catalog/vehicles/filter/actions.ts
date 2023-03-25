import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { AsyncAction } from 'types/AsyncAction';
import { VehiclesFilterParams } from 'types/VehicleFilterParams';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { getFilterData } from 'api/catalog/vehicles';
import { RequestConfig } from 'api/request';
import { initialState } from 'store/initial-state';
import { actions as vehiclesFilterActions } from './reducers';
import { getValuesToFlush, getUpdatedPrices } from './helpers';

export const fetchVehiclesFilterData = (
  params: VehiclesFilterParams = {},
  requestConfig?: RequestConfig,
): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(vehiclesFilterActions.setLoading(true));
    const {
      city: { extraCoverageRadius, current },
    } = getState();
    const preparedParams = {
      ...params,
      cityId: current.id ? [current.id!] : null,
      distance: extraCoverageRadius,
    };
    return getFilterData(preparedParams, requestConfig)
      .then(({ data }) => {
        const { values } = getState().vehiclesFilter;

        const valuesToFlush: Partial<VehiclesFilterValues> = getValuesToFlush(data, values);
        const updatedPrices = getUpdatedPrices(data, values, getState().vehiclesFilter.data);

        if (Object.keys(valuesToFlush).length) {
          dispatch(vehiclesFilterActions.setValues({ values: { ...values, ...valuesToFlush }, initial }));
        } else {
          dispatch(vehiclesFilterActions.setValues({ values: { ...values, ...updatedPrices }, initial }));
        }

        dispatch(vehiclesFilterActions.setData({ data, initial }));
      })
      .catch((err) => {
        dispatch(vehiclesFilterActions.setError(err));
      });
  };
};

export const setVehiclesFilterValues = (
  values: VehiclesFilterValues,
  fetchNewFilterData: boolean = true,
): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(vehiclesFilterActions.setValues({ values, initial }));
    if (fetchNewFilterData) {
      const { specialOffers, brands, models, generations, type } = getState().vehiclesFilter.values;
      const currentFilterValues: VehiclesFilterParams = {};
      currentFilterValues.specialOfferId = specialOffers ? specialOffers.map((v) => v.value) : undefined;
      currentFilterValues.generationId = generations ? generations.map((v) => v.value) : undefined;
      currentFilterValues.brandId = brands ? brands.map((v) => v.value) : undefined;
      currentFilterValues.modelId = models ? models.map((v) => v.value) : undefined;
      currentFilterValues.type = type !== undefined && type !== null ? type : undefined;

      dispatch(fetchVehiclesFilterData(currentFilterValues));
    }
  };
};

export const clearFilterValues = (type?: VEHICLE_TYPE_ID): AsyncAction => {
  return function (dispatch) {
    const hasType = type !== undefined;
    const clearedValues = hasType
      ? { ...initialState.vehiclesFilter.values, type }
      : initialState.vehiclesFilter.values;

    dispatch(vehiclesFilterActions.setValues({ values: clearedValues, initial: true }));
    dispatch(fetchVehiclesFilterData({ type }));
  };
};
