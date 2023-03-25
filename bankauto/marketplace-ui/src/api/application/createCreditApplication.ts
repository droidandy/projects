import API, { CancellableAxiosPromise } from 'api/request';
import { CreateCreditApplicationParamsDTO } from 'dtos/CreateCreditApplicationParamsDTO';

function createCreditApplication(params: CreateCreditApplicationParamsDTO): CancellableAxiosPromise<any> {
  return API.post('/application/credit', params, {
    authRequired: true,
  });
}

export { createCreditApplication };
