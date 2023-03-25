import API, { CancellableAxiosPromise } from 'api/request';
import { CreateDepositParamsDTO } from 'dtos/CreateDepositParamsDTO';

function createDepositApplication(params: CreateDepositParamsDTO): CancellableAxiosPromise<void> {
  return API.post('/application/deposit', params);
}

export { createDepositApplication };
