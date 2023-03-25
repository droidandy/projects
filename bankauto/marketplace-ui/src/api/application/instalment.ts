import API, { CancellableAxiosPromise } from 'api/request';
import { CreateCreditApplicationParamsDTO } from 'dtos/CreateCreditApplicationParamsDTO';

function createInstalmentApplication(params: CreateCreditApplicationParamsDTO): CancellableAxiosPromise<any> {
  return API.post('/application/instalment', params, {
    authRequired: true,
  });
}

export { createInstalmentApplication };
