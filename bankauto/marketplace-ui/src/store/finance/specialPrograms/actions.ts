import { getSpecialPrograms } from 'api';
import { AsyncAction } from 'types/AsyncAction';
import { actions as specialProgramsActions } from './reducers';

export const fetchSpecialPrograms = (): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(specialProgramsActions.setLoading(true));
    return getSpecialPrograms()
      .then(({ data }) => {
        dispatch(specialProgramsActions.setItems({ items: data, initial }));
      })
      .catch((err) => {
        dispatch(specialProgramsActions.setError(err));
      });
  };
};
