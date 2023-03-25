import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useApplicationsList = () => {
  return useStateBase('applications', actions, thunkActions);
};
