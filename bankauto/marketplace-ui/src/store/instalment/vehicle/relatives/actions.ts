import { getInstalmentVehicleRelatives } from 'api/instalment';
import { AsyncAction } from 'types/AsyncAction';
import { actions as vehiclesListActions } from './reducers';

export const fetchVehicleRelatives = (id: string | number): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(vehiclesListActions.setLoading(true));
    return getInstalmentVehicleRelatives(id)
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
