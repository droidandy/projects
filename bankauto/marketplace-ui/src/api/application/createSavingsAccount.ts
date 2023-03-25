import API, { CancellableAxiosPromise } from 'api/request';
import { CreateSavingsAccountDTO } from 'dtos/CreateSavingsAccountDTO';

function createSavingsAccount(params: CreateSavingsAccountDTO): CancellableAxiosPromise<void> {
  return API.post('/application/savings-account', params);
}

export { createSavingsAccount };
