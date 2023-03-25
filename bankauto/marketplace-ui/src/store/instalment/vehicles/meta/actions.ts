import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { AsyncAction } from 'types/AsyncAction';
import { getInstalmentVehiclesMeta } from 'api/instalment';
import { initialState } from 'store/initial-state';
import { actions as vehiclesCountActions } from './reducers';

export const fetchInstalmentMeta = (values: Partial<VehiclesFilterValues>): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(vehiclesCountActions.setLoading(true));
    return getInstalmentVehiclesMeta({
      ...initialState.instalmentFilter.values,
      ...values,
      // cityId: getState().city.current.id ? [getState().city.current.id!] : null,
      cityId: null,
    })
      .then(({ data: meta }) => {
        dispatch(vehiclesCountActions.setMeta({ meta, initial }));
      })
      .catch((err) => {
        dispatch(vehiclesCountActions.setError(err));
      });
  };
};
