import API, { CancellableAxiosPromise } from 'api/request';
import { Application, InstalmentApplicationShort, VehicleApplicationShort } from '@marketplace/ui-kit/types';

const getApplication = (id: string | number): CancellableAxiosPromise<Application> => {
  return API.get(
    `/application/item/${id}`,
    {},
    {
      authRequired: true,
    },
  );
};

const getApplications = (): CancellableAxiosPromise<VehicleApplicationShort[] | InstalmentApplicationShort[]> => {
  return API.get(
    '/application/list',
    {},
    {
      authRequired: true,
    },
  );
};

export { getApplications, getApplication };
