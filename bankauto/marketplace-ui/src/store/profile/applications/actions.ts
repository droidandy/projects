import { AsyncAction } from 'types/AsyncAction';
import { getApplications } from 'api/application';
import { actions as applicationsListActions } from './reducers';

export const fetchApplicationsListItems = (): AsyncAction => {
  return function (dispatch) {
    dispatch(applicationsListActions.setLoading(true));
    return getApplications()
      .then(({ data }) => {
        dispatch(applicationsListActions.setItems({ items: data }));
      })
      .catch((err) => {
        dispatch(applicationsListActions.setError(err));
      })
      .finally(() => dispatch(applicationsListActions.setLoading(false)));
  };
};
