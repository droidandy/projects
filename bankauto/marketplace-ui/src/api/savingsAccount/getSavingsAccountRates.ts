import API from 'api/request';
import { AxiosResponse } from 'axios';
import { SavingsAccountRate } from 'containers/Finance/SavingsAccount/types';

function getSavingsAccountRates(): Promise<AxiosResponse<SavingsAccountRate>> {
  return API.get('/catalog/savings-account/rates');
}

export { getSavingsAccountRates };
