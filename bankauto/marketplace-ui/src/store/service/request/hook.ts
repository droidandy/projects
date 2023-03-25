import { useStateModel } from 'store/utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useServiceRequest = () => {
  return useStateModel('serviceRequest', actions, thunkActions);
};
