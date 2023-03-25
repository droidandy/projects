import { AsyncAction } from 'types/AsyncAction';
import { getVehicleRelatives } from 'api/catalog';
import { actions as vehiclesListActions } from './reducers';

export const fetchVehicleRelatives = (id: string | number): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(vehiclesListActions.setLoading(true));
    const {
      city: { extraCoverageRadius, current },
    } = getState();
    const ids = [1, 2];
    const preparedParams =
      current.id && !ids.includes(current.id)
        ? {
            cityId: current.id,
            distance: extraCoverageRadius || 0,
          }
        : {};
    return getVehicleRelatives(id, preparedParams)
      .then(({ data }) => {
        dispatch(vehiclesListActions.setRelatives({ items: data, initial }));
      })
      .catch((err) => {
        dispatch(vehiclesListActions.setError(err));
      });
  };
};

export const clearVehicleRelatives = (): AsyncAction => {
  return function (dispatch) {
    dispatch(vehiclesListActions.setRelatives({ items: null }));
  };
};
