import API, { CancellableAxiosPromise } from '../request';
import { Insurance } from '@marketplace/ui-kit/types';

export const getInsurances = (): CancellableAxiosPromise<Insurance[]> => {
  return API.get(
    '/insurance/list',
    {},
    {
      authRequired: true,
      withCredentials: true,
    },
  );
};
