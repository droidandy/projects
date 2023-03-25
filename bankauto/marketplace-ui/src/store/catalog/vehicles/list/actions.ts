import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { AsyncAction } from 'types/AsyncAction';
import { getVehicles } from 'api/catalog';
import { actions as vehiclesListActions } from './reducers';

export const setVehiclesListItems =
  (values: VehiclesFilterValues, sort: VehicleSortType | null, page?: number): AsyncAction<Promise<void>> =>
  (dispatch, getState, { initial }) => {
    const {
      vehiclesList: { pageLimit, currentPage },
      city: {
        current: { id: currentCityId },
        extraCoverageRadius,
      },
    } = getState();
    if (page === currentPage)
      return Promise.reject(new Error('Trying to fetch already fetched page')).catch((err) => console.log(err));
    dispatch(vehiclesListActions.setLoading(true));
    const preparedValues = {
      ...values,
      cityId: currentCityId ? [currentCityId!] : null,
      distance: extraCoverageRadius,
    };

    return getVehicles(preparedValues, page || 1, pageLimit, sort)
      .then(({ data }) => {
        dispatch(vehiclesListActions.setItems({ items: data, initial, page }));
      })
      .catch((err) => {
        dispatch(vehiclesListActions.setError(err));
      });
  };
