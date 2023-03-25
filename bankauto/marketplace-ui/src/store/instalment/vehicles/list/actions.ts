import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { AsyncAction } from 'types/AsyncAction';
import { getInstalmentVehicles } from 'api/instalment';
// import { sendCatalogViewAnalytics } from 'helpers/analytics';
import { actions as instalmentListActions } from './reducers';

export const setInstalmentListItems = (
  values: VehiclesFilterValues,
  sort: VehicleSortType,
  page?: number,
): AsyncAction<Promise<void>> => {
  return function (dispatch, getState, { initial }) {
    const {
      instalmentList: { currentPage, pageLimit },
    } = getState();
    if (page === currentPage)
      return Promise.reject(new Error('Trying to fetch already fetched page')).catch((err) => console.log(err));
    dispatch(instalmentListActions.setLoading(true));
    return getInstalmentVehicles(
      // { ...values, cityId: getState().city.current.id ? [getState().city.current.id!] : null },
      { ...values, cityId: null },
      page || 1,
      pageLimit,
      sort,
    )
      .then(({ data }) => {
        dispatch(instalmentListActions.setItems({ items: data, initial, page }));
      })
      .catch((err) => {
        dispatch(instalmentListActions.setError(err));
      });
  };
};

export const addInstalmentListItems = (values: VehiclesFilterValues, sort: VehicleSortType): AsyncAction => {
  return function (dispatch, getState) {
    dispatch(instalmentListActions.setLoadingPage(true));
    return getInstalmentVehicles(
      // { ...values, cityId: getState().city.current.id ? [getState().city.current.id!] : null },
      { ...values, cityId: null },
      getState().instalmentList.currentPage + 1,
      getState().instalmentList.pageLimit,
      sort,
    )
      .then(({ data }) => {
        if (data && data.length) {
          // sendCatalogViewAnalytics(data);
          dispatch(instalmentListActions.addItems(data));
        }
      })
      .catch((err) => {
        dispatch(instalmentListActions.setErrorPage(err));
      });
  };
};
