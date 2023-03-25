import { useStateBase } from '../../utils';
import { actions } from './reducers';
import * as thunkActions from './actions';

export const useInstalmentBestOffers = () => {
  return useStateBase('instalmentBestOffers', actions, thunkActions);
};
