import { AsyncAction } from 'types/AsyncAction';
import { getLinks } from 'api';
import { actions } from './reducers';

export const fetchLinks = ({ path }: { path: string }): AsyncAction => {
  return function (dispatch) {
    dispatch(actions.setLoading(true));
    return getLinks(path)
      .then(({ data }) => {
        dispatch(actions.setLoading(false));
        dispatch(actions.setInitial(true));
        dispatch(actions.setLinks({ links: data }));
      })
      .catch((err) => {
        dispatch(actions.setError(err));
      });
  };
};
