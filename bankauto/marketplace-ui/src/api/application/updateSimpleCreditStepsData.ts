import API, { CancellableAxiosPromise } from 'api/request';
import { CreditStepsApplicationParamsDTO } from 'dtos/CreditStepsApplicationParamsDTO';

function updateSimpleCreditStepsData(
  id: number,
  uuid: string | number,
  params: CreditStepsApplicationParamsDTO,
): CancellableAxiosPromise<any> {
  return API.put(`/application/simple-credit/${id}/${uuid}/steps`, params, {
    authRequired: true,
  });
}

export { updateSimpleCreditStepsData };
