import { useStateBase } from 'store/utils';
import { actions } from './reducers';

export const useLinks = () => {
  return useStateBase('links', actions, {});
};
