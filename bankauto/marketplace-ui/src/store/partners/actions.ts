import { AsyncAction } from 'types/AsyncAction';
import { actions as dealerPartnerActions } from './reducers';

import { getPartners } from '../../api';

export const fetchPartners = (): AsyncAction => {
  return function (dispatch) {
    dispatch(dealerPartnerActions.setLoading(true));
    return getPartners()
      .then(({ data }) => {
        dispatch(dealerPartnerActions.setPartners({ partners: data, initial: true }));
      })
      .catch((err) => {
        dispatch(dealerPartnerActions.setError(err));
      });
  };
};
