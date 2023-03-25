import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useExchangeRates = () => {
  return useStateBase('exchangeRates', actions, thunkActions);
};
