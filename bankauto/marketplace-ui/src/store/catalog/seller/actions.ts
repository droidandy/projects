import { AsyncAction } from 'types/AsyncAction';
import { getSellerInfo } from 'api';
import { actions as sellerActions } from './reducers';

export const fetchSellerInfo =
  (id: number | string): AsyncAction =>
  (dispatch, getState, { initial }) => {
    dispatch(sellerActions.setLoading(true));
    return getSellerInfo(id)
      .then(({ data }) => {
        dispatch(sellerActions.setSellerInfo({ info: data, initial }));
      })
      .catch((e) => {
        dispatch(sellerActions.setError(e));
      });
  };
