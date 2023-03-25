import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useCity = () => {
  return useStateBase('city', actions, thunkActions);
};
