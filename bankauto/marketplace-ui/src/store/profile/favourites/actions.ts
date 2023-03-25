import { AsyncAction } from 'types/AsyncAction';
import { getFavourites, addToFavourites, deleteFromFavourites } from 'api/client/favourites';
import { actions } from './reducers';

export const fetchFavourites = (): AsyncAction => (dispatch, getState) => {
  if (!getState().favourites.loading) {
    dispatch(actions.setLoading(true));
  }

  return getFavourites()
    .then(({ data }) => {
      dispatch(actions.setItems({ items: data }));
    })
    .catch((err) => {
      dispatch(actions.setError(err));
    });
};

export const makeFavourite =
  (vehicleId: number): AsyncAction<Promise<void>> =>
  (dispatch) => {
    dispatch(actions.setLoading(true));

    return addToFavourites(vehicleId)
      .then(() => {
        dispatch(fetchFavourites());
      })
      .catch((err) => {
        dispatch(actions.setError(err));
        throw err;
      });
  };

export const removeFromFavourites =
  (vehicleId: number): AsyncAction<Promise<void>> =>
  (dispatch, getState) => {
    dispatch(actions.setLoading(true));
    const {
      favourites: { items },
    } = getState();

    return deleteFromFavourites(vehicleId)
      .then(() => {
        dispatch(actions.setItems({ items: items?.filter((item) => item.id !== vehicleId) || [] }));
      })
      .catch((err) => {
        dispatch(actions.setError(err));
        throw err;
      });
  };
