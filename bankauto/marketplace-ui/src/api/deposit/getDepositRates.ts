import { DepositOptions, DepositRates } from '@marketplace/ui-kit/types';
import API from 'api/request';
import { AxiosResponse } from 'axios';
import { EXPENSES_TYPE_MAP } from 'containers/Finance/Deposit/constants/expensesTypeMap';

export type Params = {
  term: number;
  options: DepositOptions;
  turnover: typeof EXPENSES_TYPE_MAP[number];
};

function getDepositRates(params: Params): Promise<AxiosResponse<DepositRates>> {
  return API.get('/deposit/rates', params);
}

export { getDepositRates };
