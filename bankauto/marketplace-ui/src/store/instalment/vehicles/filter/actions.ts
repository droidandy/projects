import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { AsyncAction } from 'types/AsyncAction';
import { initialState } from 'store/initial-state';
import { VehiclesFilterParams } from 'types/VehicleFilterParams';
import { actions as instalmentFilterActions } from './reducers';
import { getValuesToFlush } from './helpers';
import { getInstalmentFilterData } from '../../../../api/instalment';

export const fetchInstalmentVehiclesFilterData = (params: VehiclesFilterParams = {}): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(instalmentFilterActions.setLoading(true));
    return getInstalmentFilterData({
      ...params,
      cityId: null,
      // cityId: getState().city.current.id ? [getState().city.current.id!] : null,
    })
      .then(({ data }) => {
        const { values } = getState().instalmentFilter;
        const valuesToFlush: Partial<VehiclesFilterValues> = getValuesToFlush(data, values);

        if (Object.keys(valuesToFlush).length) {
          dispatch(instalmentFilterActions.setValues({ values: { ...values, ...valuesToFlush }, initial }));
        }

        dispatch(instalmentFilterActions.setData({ data, initial }));
      })
      .catch((err) => {
        dispatch(instalmentFilterActions.setError(err));
      });
  };
};

export const setInstalmentVehiclesFilterValues = (
  values: VehiclesFilterValues,
  fetchNewFilterData: boolean = true,
): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(instalmentFilterActions.setValues({ values, initial }));
    if (fetchNewFilterData) {
      const { brands, models } = values;
      const params: VehiclesFilterParams = {};
      params.brandId = brands ? brands.map((v) => v.value) : undefined;
      params.modelId = models ? models.map((v) => v.value) : undefined;

      dispatch(fetchInstalmentVehiclesFilterData(params));
    }
  };
};

export const clearFilterValues = (type?: VEHICLE_TYPE_ID): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    const hasType = type !== undefined;
    const newValues = hasType
      ? { ...initialState.instalmentFilter.values, type: type ?? null }
      : initialState.instalmentFilter.values;

    dispatch(instalmentFilterActions.setValues({ values: newValues, initial }));
    dispatch(fetchInstalmentVehiclesFilterData({ type }));
  };
};
