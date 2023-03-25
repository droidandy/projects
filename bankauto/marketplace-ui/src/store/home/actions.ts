import { AsyncAction } from 'types/AsyncAction';
import { HomeTab } from 'types/Home';
import { actions as homeStateActions } from './reducers';

export const setActiveTab = (tab: HomeTab): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(homeStateActions.setTabState({ tab, initial }));
  };
};
