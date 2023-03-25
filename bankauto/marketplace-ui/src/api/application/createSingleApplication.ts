import API, { CancellableAxiosPromise } from 'api/request';
import { Application } from '@marketplace/ui-kit/types';
import { SingleApplication } from 'types/SingleApplication';

function createSingleApplication(singleApplication: SingleApplication): CancellableAxiosPromise<Application> {
  return API.post('/application/create', singleApplication, {
    authRequired: true,
  });
}

export { createSingleApplication };
