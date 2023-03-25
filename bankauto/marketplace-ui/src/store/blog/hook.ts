import { useStateBase } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useBlogPosts = () => {
  return useStateBase('blog', actions, thunkActions);
};
