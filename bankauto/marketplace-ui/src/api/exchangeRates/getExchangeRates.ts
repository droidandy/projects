import { ExchangeRates } from '@marketplace/ui-kit/types/';
import API, { CancellableAxiosPromise } from 'api/request';

function getExchangeRates(): CancellableAxiosPromise<ExchangeRates> {
  return API.get('catalog/rates');
}

export { getExchangeRates };
