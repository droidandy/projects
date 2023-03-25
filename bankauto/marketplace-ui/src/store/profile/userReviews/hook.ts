import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useUserReviews = () => {
  return useStateBase('userReviews', actions, thunkActions);
};
