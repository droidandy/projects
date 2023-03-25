import { AsyncAction } from 'types/AsyncAction';
import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { getBestOffers } from 'api/car';
import { actions as bestOffersActions } from './reducers';

export const fetchBestOffers = (type?: VEHICLE_TYPE, priceMin?: number, priceMax?: number): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(bestOffersActions.setLoading(true));
    const {
      city: { extraCoverageRadius },
    } = getState();
    return getBestOffers(type || VEHICLE_TYPE.NEW, {
      cityId: getState().city.current.id ? [getState().city.current.id!] : null,
      distance: extraCoverageRadius,
      price_min: priceMin || undefined,
      price_max: priceMax || undefined,
    })
      .then(({ data }) => {
        dispatch(bestOffersActions.setItems({ items: data, initial }));
      })
      .catch((err) => {
        dispatch(bestOffersActions.setError(err));
      });
  };
};
