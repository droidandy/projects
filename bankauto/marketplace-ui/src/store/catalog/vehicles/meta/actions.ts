import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { AsyncAction } from 'types/AsyncAction';
import { getVehiclesMeta } from 'api/catalog';
import { initialState } from 'store/initial-state';
import { RequestConfig } from 'api/request';
import { actions as vehiclesCountActions } from './reducers';

export const fetchVehiclesMeta = (
  values: Partial<VehiclesFilterValues>,
  requestConfig?: RequestConfig,
): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(vehiclesCountActions.setLoading(true));
    const {
      city: {
        current: { id: currentCityId },
        extraCoverageRadius,
      },
    } = getState();
    const preparedValues = {
      ...initialState.vehiclesFilter.values,
      ...values,
      cityId: currentCityId ? [currentCityId!] : null,
      distance: extraCoverageRadius,
    };

    return getVehiclesMeta(preparedValues, requestConfig)
      .then(({ data: meta }) => {
        dispatch(vehiclesCountActions.setMeta({ meta, initial }));
      })
      .catch((err) => {
        dispatch(vehiclesCountActions.setError(err));
      });
  };
};
