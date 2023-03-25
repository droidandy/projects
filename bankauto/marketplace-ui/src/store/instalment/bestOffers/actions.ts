import { AsyncAction } from 'types/AsyncAction';
import { getInstalmentBestOffers } from 'api/instalment';
import { actions as bestOffersActions } from './reducers';

export const fetchBestOffers = (): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(bestOffersActions.setLoading(true));
    return getInstalmentBestOffers({
      cityId: null,
      // cityId: getState().city.current.id ? [getState().city.current.id!] : null,
    })
      .then(({ data }) => {
        dispatch(bestOffersActions.setItems({ items: data, initial }));
      })
      .catch((err) => {
        dispatch(bestOffersActions.setError(err));
      });
  };
};
