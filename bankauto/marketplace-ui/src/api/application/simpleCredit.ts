import API, { CancellableAxiosPromise } from 'api/request';
import {
  CreateSimpleCreditParamsDTO,
  BasicSimpleCreditParamsDTO,
  AdditionalSimpleCreditParamsDTO,
  EmploymentSimpleCreditParamsDTO,
} from 'dtos/SimpleCreditDTO';

function createSimpleCredit(
  params: CreateSimpleCreditParamsDTO,
): CancellableAxiosPromise<{ id: number; uuid: string }> {
  return API.post('/application/simple-credit', params, {
    authRequired: true,
  });
}

function addBasicInfoSimpleCredit(
  id: number,
  uuid: string,
  params: BasicSimpleCreditParamsDTO,
): CancellableAxiosPromise<void> {
  return API.put(`/application/simple-credit/basic/${id}/${uuid}`, params, {
    authRequired: true,
  });
}

function addAdditionalInfoSimpleCredit(
  id: number,
  uuid: string,
  params: AdditionalSimpleCreditParamsDTO,
): CancellableAxiosPromise<void> {
  return API.put(`/application/simple-credit/additional/${id}/${uuid}`, params, {
    authRequired: true,
  });
}

function addEmploymentInfoSimpleCredit(
  id: number,
  uuid: string,
  params: EmploymentSimpleCreditParamsDTO,
): CancellableAxiosPromise<void> {
  return API.put(`/application/simple-credit/job/${id}/${uuid}`, params, {
    authRequired: true,
  });
}

export { createSimpleCredit, addBasicInfoSimpleCredit, addAdditionalInfoSimpleCredit, addEmploymentInfoSimpleCredit };
