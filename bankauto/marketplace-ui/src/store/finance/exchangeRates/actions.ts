import { getExchangeRates } from 'api';
import { AsyncAction } from 'types/AsyncAction';
import { actions as exchangeRatesActions } from './reducers';

export const fetchExchangeRates = (): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(exchangeRatesActions.setLoading(true));
    return getExchangeRates()
      .then(({ data }) => {
        dispatch(exchangeRatesActions.setExchangeRates({ rate: data, initial }));
      })
      .catch((err) => {
        dispatch(exchangeRatesActions.setError(err));
      });
  };
};
