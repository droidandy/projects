import { AdvertiseList } from '@marketplace/ui-kit/types';
import API, { CancellableAxiosPromise } from 'api/request';

function getBankingAdvertiseList(count: string): CancellableAxiosPromise<AdvertiseList> {
  return API.get(`/banking/advertise/${count}`);
}

export { getBankingAdvertiseList };
