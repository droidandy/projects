import { getInstalmentVehicle } from 'api/instalment';
import { AsyncAction } from 'types/AsyncAction';
import { actions as vehiclesListActions } from './reducers';

export const fetchVehicleItem = (brandAlias: string, modelAlias: string, id: string | number): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(vehiclesListActions.setLoading(true));
    return getInstalmentVehicle(brandAlias, modelAlias, id)
      .then(({ data }) => {
        dispatch(vehiclesListActions.setVehicle({ vehicle: data, initial }));
      })
      .catch((err) => {
        dispatch(vehiclesListActions.setError(err));
      });
  };
};
