import { AsyncAction } from 'types/AsyncAction';
import { getBankingAdvertiseList } from 'api';
import { actions as advertiseListActions } from './reducers';

export const fetchAdvertiseList = (count: number): AsyncAction => {
  return (dispatch) => {
    dispatch(advertiseListActions.setLoading(true));
    return getBankingAdvertiseList(`${count}`)
      .then(({ data }) => {
        dispatch(advertiseListActions.setAdvertiseList(data));
      })
      .catch((err) => {
        dispatch(advertiseListActions.setError(err));
      });
  };
};
