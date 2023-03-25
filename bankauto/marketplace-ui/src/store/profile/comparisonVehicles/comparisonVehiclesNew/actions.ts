import { AsyncAction } from 'types/AsyncAction';
import { getComparisonVehiclesNew } from 'api/client/comparison';
import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { removeComparisonId } from 'store/comparisonIds';
import { actions } from './reducers';

export const fetchComparisonVehiclesNew = (): AsyncAction => (dispatch, getState) => {
  dispatch(actions.setLoading(true));
  const equipmentIds = getState().comparisonIds.data.new;

  return getComparisonVehiclesNew(equipmentIds)
    .then(({ data }) => {
      dispatch(actions.setData({ data }));
    })
    .catch((err) => {
      dispatch(actions.setError(err));
    });
};

export const removeComparisonVehicleNew =
  (offerId: number): AsyncAction =>
  (dispatch, getState) => {
    const { comparisonVehiclesNew } = getState();
    const currentItems = comparisonVehiclesNew.items;
    const updatedItems = currentItems.filter((item) => item.vehicleId !== offerId);

    dispatch(actions.setItems({ items: updatedItems }));
    return dispatch(removeComparisonId(offerId, VEHICLE_TYPE.NEW)).catch((err) => {
      dispatch(actions.setItems({ items: currentItems }));
      dispatch(actions.setError(err));
    });
  };
