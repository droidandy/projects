import { AsyncAction } from 'types/AsyncAction';
import { Pending } from 'helpers/pendings';
import { getVehicleCreateOptions } from 'api/catalog/createData';
import { actions as vehiclesCreateOptionsActions } from './reducers';

export const fetchVehicleCreateOptions = (): AsyncAction => {
  return (dispatch) => {
    // dispatch(vehiclesCreateOptionsActions.setLoading(true));
    return Pending('get-create-options', getVehicleCreateOptions())
      .then(({ data }) => {
        dispatch(vehiclesCreateOptionsActions.setOptions({ options: data, initial: true }));
      })
      .catch((err) => {
        dispatch(vehiclesCreateOptionsActions.setError(err));
      });
  };
};
