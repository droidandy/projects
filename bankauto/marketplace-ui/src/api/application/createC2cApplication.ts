import API, { CancellableAxiosPromise } from 'api/request';
import { CreateCreditApplicationParamsDTO } from 'dtos/CreateCreditApplicationParamsDTO';

function createC2cApplication(params: CreateCreditApplicationParamsDTO): CancellableAxiosPromise<any> {
  return API.post('/application/vehicle-c2c', params, {
    authRequired: true,
  });
}

export { createC2cApplication };
