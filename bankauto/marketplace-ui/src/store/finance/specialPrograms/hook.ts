import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useSpecialPrograms = () => {
  return useStateBase('specialPrograms', actions, thunkActions);
};
