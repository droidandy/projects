import { AsyncAction } from 'types/AsyncAction';
import { BreadCrumbsItem } from 'types/BreadCrumbs';
import { actions } from './reducers';

export const setBreadCrumbsData = (items: BreadCrumbsItem[]): AsyncAction => {
  return function (dispatch) {
    dispatch(actions.setBreadCrumbs({ items }));
  };
};
