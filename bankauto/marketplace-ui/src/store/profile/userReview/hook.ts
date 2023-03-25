import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useUserReview = () => {
  return useStateBase('userReview', actions, thunkActions);
};
