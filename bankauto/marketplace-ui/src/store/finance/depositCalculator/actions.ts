import { Params } from 'api/deposit/getDepositRates';
import { AsyncAction } from 'types/AsyncAction';
import { getDepositRates } from 'api';
import { actions as depositCalculatorActions, actions } from './reducers';

export const fetchDepositRates = (params: Params): AsyncAction => {
  return function (dispatch) {
    dispatch(actions.setLoading(true));
    return getDepositRates(params)
      .then(({ data }) => {
        dispatch(actions.setLoading(false));
        dispatch(actions.setInitial(true));
        dispatch(depositCalculatorActions.setDepositRate({ depositRate: +data.rate, addition: +data.addition }));
      })
      .catch((err) => {
        dispatch(actions.setError(err));
      });
  };
};
