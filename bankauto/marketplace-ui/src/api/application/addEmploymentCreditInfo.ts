import API, { CancellableAxiosPromise } from 'api/request';
import { EmploymentCreditApplicationParamsDTO } from 'dtos/EmploymentCreditApplicationParamsDTO';

function addEmploymentCreditInfo(
  id: number,
  params: EmploymentCreditApplicationParamsDTO,
  uuid?: number,
): CancellableAxiosPromise<any> {
  const uuidInUrl = uuid ? `/${uuid}` : '';
  return API.put(`/application/credit/${id}/job${uuidInUrl}`, params, {
    authRequired: true,
  });
}

export { addEmploymentCreditInfo };
