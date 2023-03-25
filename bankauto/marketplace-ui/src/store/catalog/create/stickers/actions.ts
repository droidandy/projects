import { AsyncAction } from 'types/AsyncAction';
import { Pending } from 'helpers/pendings';
import { getVehicleCreateStickers } from 'api/catalog/createData';
import { actions as vehiclesCreateStickersActions } from './reducers';

export const fetchVehicleCreateStickers = (): AsyncAction => {
  return (dispatch) => {
    return Pending('get-create-stickers', getVehicleCreateStickers())
      .then(({ data }) => {
        dispatch(vehiclesCreateStickersActions.setStickers({ stickers: data, initial: true }));
      })
      .catch((err) => {
        dispatch(vehiclesCreateStickersActions.setError(err));
      });
  };
};
