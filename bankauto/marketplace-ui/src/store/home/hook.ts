import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useHomeState = () => {
  return useStateBase('home', actions, thunkActions);
};
