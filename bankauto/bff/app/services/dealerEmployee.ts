import { AxiosResponse } from 'axios';
import API, { DIR_URL } from '../config';
import {
  Employee,
  EmployeeBrand,
  EmployeeInput,
  EmployeeOffice,
  SetEmployeeBrandInput,
  SetEmployeeOfficeInput,
} from '@marketplace/ui-kit/types';
import { AuthHeaders } from '../utils/authHelpers';
import { EmployeeBrandDTO, EmployeeDTO, EmployeeOfficeDTO } from '../types/dtos/employee.dto';
import { EmployeeBrandMapper, EmployeeMapper, EmployeeOfficeMapper } from './mappers/employee.mapper';

const mapper = (dto: EmployeeDTO) => EmployeeMapper({}, dto);
const brandMapper = (dto: EmployeeBrandDTO) => EmployeeBrandMapper({}, dto);
const officeMapper = (dto: EmployeeOfficeDTO) => EmployeeOfficeMapper({}, dto);

export const getEmployee = (id: string | number, auth: AuthHeaders): Promise<AxiosResponse<Employee>> => {
  return API.get<EmployeeDTO>(
    `/v1/dealer/user/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: mapper(response.data) }));
};

export const getEmployees = (auth: AuthHeaders): Promise<AxiosResponse<Employee[]>> => {
  return API.get<EmployeeDTO[]>(
    '/v1/dealer/users',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: response.data.map(mapper) }));
};

export const createEmployee = (
  auth: AuthHeaders,
  { firstName, lastName, patronymicName, email, phone, role, salesOfficeId, permissions }: EmployeeInput,
): Promise<AxiosResponse<Employee>> => {
  return API.post<EmployeeDTO>(
    '/v1/dealer/user',
    {
      first_name: firstName,
      last_name: lastName,
      patronymic_name: patronymicName,
      email,
      phone,
      role,
      sales_office_id: salesOfficeId,
      permissions,
    },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: mapper(response.data) }));
};

export const updateEmployee = (
  auth: AuthHeaders,
  id: string | number,
  { firstName, lastName, patronymicName, email, phone, role, salesOfficeId, permissions }: EmployeeInput,
): Promise<AxiosResponse<Employee>> => {
  return API.put<EmployeeDTO>(
    `/v1/dealer/user/${id}`,
    {
      first_name: firstName,
      last_name: lastName,
      patronymic_name: patronymicName,
      email,
      phone,
      role,
      sales_office_id: salesOfficeId,
      permissions,
    },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: mapper(response.data) }));
};

export const fireEmployee = (auth: AuthHeaders, id: string | number): Promise<AxiosResponse<void>> => {
  return API.put<void>(
    `/v1/dealer/user/set-status-blocked/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
};

export const hireEmployee = (auth: AuthHeaders, id: string | number): Promise<AxiosResponse<void>> => {
  return API.put<void>(
    `/v1/dealer/user/set-status-active/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
};

export const setEmployeeBrand = (
  auth: AuthHeaders,
  id: string | number,
  { brandId }: SetEmployeeBrandInput,
): Promise<AxiosResponse<EmployeeBrand>> => {
  return API.post<EmployeeBrandDTO>(
    `/v1/dealer/user-brand/${id}`,
    { brand_id: brandId },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((result) => ({ ...result, data: brandMapper(result.data) }));
};

export const deleteEmployeeBrand = (
  auth: AuthHeaders,
  id: string | number,
  { brandId }: SetEmployeeBrandInput,
): Promise<AxiosResponse<EmployeeBrand>> => {
  return API.delete<EmployeeBrandDTO>(
    `/v1/dealer/user-brand/${id}`,
    { brand_id: brandId },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((result) => ({ ...result, data: brandMapper(result.data) }));
};

export const getEmployeeBrands = (auth: AuthHeaders, id: string | number): Promise<AxiosResponse<EmployeeBrand[]>> => {
  return API.get<EmployeeBrandDTO[]>(
    `/v1/dealer/user-brands/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((result) => ({ ...result, data: result.data.map(brandMapper) }));
};

export const setEmployeeOffice = (
  auth: AuthHeaders,
  id: string | number,
  { officeId }: SetEmployeeOfficeInput,
): Promise<AxiosResponse<EmployeeOffice>> => {
  return API.post<EmployeeOfficeDTO>(
    `/v1/dealer/user-sales-office/${id}`,
    { sales_office_id: officeId },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((result) => ({ ...result, data: officeMapper(result.data) }));
};

export const deleteEmployeeOffice = (
  auth: AuthHeaders,
  id: string | number,
  { officeId }: SetEmployeeOfficeInput,
): Promise<AxiosResponse<EmployeeOffice>> => {
  return API.delete<EmployeeOfficeDTO>(
    `/v1/dealer/user-sales-office/${id}`,
    { sales_office_id: officeId },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((result) => ({ ...result, data: officeMapper(result.data) }));
};

export const getEmployeeOffices = (
  auth: AuthHeaders,
  id: string | number,
): Promise<AxiosResponse<EmployeeOffice[]>> => {
  return API.get<EmployeeOfficeDTO[]>(
    `/v1/dealer/user-sales-offices/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((result) => ({ ...result, data: result.data.map(officeMapper) }));
};
