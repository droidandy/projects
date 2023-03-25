import API, { CancellableAxiosPromise } from 'api/request';
import { BasicCreditApplicationParamsDTO } from 'dtos/BasicCreditApplicationParamsDTO';

function addBasicCreditInfo(
  id: number,
  params: BasicCreditApplicationParamsDTO,
  uuid?: number,
): CancellableAxiosPromise<any> {
  const uuidInUrl = uuid ? `/${uuid}` : '';
  return API.put(`/application/credit/${id}/basic${uuidInUrl}`, params, {
    authRequired: true,
  });
}

export { addBasicCreditInfo };
