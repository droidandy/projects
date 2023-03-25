import { getSpecialProgram, getVehiclesBySpecialProgram } from 'api';
import { AsyncAction } from 'types/AsyncAction';
import { actions as specialProgramActions } from './reducers';

export const fetchSpecialProgram = (slug: string): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(specialProgramActions.setLoading(true));
    return getSpecialProgram(slug)
      .then(({ data }) => {
        dispatch(specialProgramActions.setData({ data, initial }));
      })
      .catch((err) => {
        dispatch(specialProgramActions.setError(err));
      });
  };
};

export const fetchVehiclesBySpecialProgram = (id: number): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(specialProgramActions.setLoading(true));
    return getVehiclesBySpecialProgram(id)
      .then(({ data }) => {
        dispatch(specialProgramActions.setVehicles({ data, initial }));
      })
      .catch((err) => {
        dispatch(specialProgramActions.setError(err));
      });
  };
};
