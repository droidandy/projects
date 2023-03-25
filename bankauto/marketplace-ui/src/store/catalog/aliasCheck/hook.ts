import { useStateBase } from '../../utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useCheckAlias = () => {
  return useStateBase('aliasCheck', actions, thunkActions);
};
