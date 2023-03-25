import { CreateDebitParamsDTO } from 'dtos/CreateDebitParamsDTO';
import API, { CancellableAxiosPromise } from 'api/request';

function createDebitApplication(params: CreateDebitParamsDTO): CancellableAxiosPromise<void> {
  return API.post('/application/card-debit', params);
}

export { createDebitApplication };
