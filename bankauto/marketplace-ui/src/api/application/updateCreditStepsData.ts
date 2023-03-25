import API, { CancellableAxiosPromise } from 'api/request';
import { CreditStepsApplicationParamsDTO } from 'dtos/CreditStepsApplicationParamsDTO';

function updateCreditStepsData(
  id: number,
  params: CreditStepsApplicationParamsDTO,
  uuid?: number,
): CancellableAxiosPromise<any> {
  const uuidInUrl = uuid ? `/${uuid}` : '';
  return API.put(`/application/credit/${id}/steps${uuidInUrl}`, params, {
    authRequired: true,
  });
}

export { updateCreditStepsData };
