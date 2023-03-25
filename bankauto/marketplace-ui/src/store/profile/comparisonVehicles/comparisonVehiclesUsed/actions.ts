import { AsyncAction } from 'types/AsyncAction';
import { getComparisonVehiclesUsed } from 'api/client/comparison';
import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { removeComparisonId } from 'store/comparisonIds';
import { actions } from './reducers';

export const fetchComparisonVehiclesUsed = (): AsyncAction => (dispatch, getState) => {
  dispatch(actions.setLoading(true));
  const offerIds = getState().comparisonIds.data.used;

  return getComparisonVehiclesUsed(offerIds)
    .then(({ data }) => {
      dispatch(actions.setData({ data }));
    })
    .catch((err) => {
      dispatch(actions.setError(err));
    });
};

export const removeComparisonVehicleUsed =
  (offerId: number): AsyncAction =>
  (dispatch, getState) => {
    dispatch(actions.setLoading(true));
    const { comparisonVehiclesUsed } = getState();
    const currentItems = comparisonVehiclesUsed.items;
    const updatedItems = currentItems.filter((item) => item.id !== offerId);

    dispatch(actions.setItems({ items: updatedItems }));
    return dispatch(removeComparisonId(offerId, VEHICLE_TYPE.USED)).catch((err) => {
      dispatch(actions.setItems({ items: currentItems }));
      dispatch(actions.setError(err));
    });
  };
