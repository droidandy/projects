import API, { CancellableAxiosPromise } from 'api/request';
import { Seller } from '@marketplace/ui-kit/types';

function getSellerInfo(id: string | number): CancellableAxiosPromise<Seller> {
  return API.get(
    `/client/seller/info/${id}`,
    {},
    {
      authRequired: true,
    },
  );
}

export { getSellerInfo };
