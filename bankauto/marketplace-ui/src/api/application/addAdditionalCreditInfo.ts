import API, { CancellableAxiosPromise } from 'api/request';
import { AdditionalCreditApplicationParamsDTO } from 'dtos/AdditionalCreditApplicationParamsDTO';

function addAdditionalCreditInfo(
  id: number,
  params: AdditionalCreditApplicationParamsDTO,
  uuid?: number,
): CancellableAxiosPromise {
  const uuidInUrl = uuid ? `/${uuid}` : '';
  return API.put(`/application/credit/${id}/additional${uuidInUrl}`, params, {
    authRequired: true,
  });
}

export { addAdditionalCreditInfo };
