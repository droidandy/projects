import { AxiosResponse } from 'axios';
import API, { DIR_URL } from '../config';

import { AuthHeaders } from '../utils/authHelpers';
import { Brand, Office, OfficeCount, OfficeOrganization, Phone } from '@marketplace/ui-kit/types';
import { OfficeCountDTO, OfficeDTO, OfficeOrganizationDTO, PhoneDTO } from '../types/dtos/office.dto';
import { OfficeMapper, OfficeOrganizationMapper, PhoneMapper } from './mappers/office.mapper';
import { BrandDTO } from '../types/dtos/node.dto';
import { BrandMapper } from './mappers/node.mapper';

const mapper = (dto: OfficeDTO) => OfficeMapper({}, dto);

export const getOffice = (id: string | number, auth: AuthHeaders): Promise<AxiosResponse<Office>> => {
  return API.get<OfficeDTO>(
    `/v1/dealer/sales-office/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({
    ...response,
    data: mapper({ ...response.data, service_time: JSON.stringify(response.data.service_time) }), // service_time приходит в массиве вместо строки
  }));
};

export const getOffices = (auth: AuthHeaders): Promise<AxiosResponse<Office[]>> => {
  return API.get<OfficeDTO[]>(
    '/v1/dealer/sales-offices',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({
    ...response,
    data: response.data.map(mapper),
  }));
};

export const getOfficesCount = (auth: AuthHeaders): Promise<AxiosResponse<OfficeCount>> => {
  return API.get<OfficeCountDTO>(
    '/v1/dealer/sales-offices/count',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
};

const phoneMapper = (dto: PhoneDTO) => PhoneMapper({}, dto);

export const getOfficePhones = (id: string | number, auth: AuthHeaders): Promise<AxiosResponse<Phone[]>> => {
  return API.get<PhoneDTO[]>(
    `/v1/dealer/sales-office-phones/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({
    ...response,
    data: response.data.map(phoneMapper),
  }));
};

const organizationMapper = (dto: OfficeOrganizationDTO) => OfficeOrganizationMapper({}, dto);

export const getOfficeOrganizations = (
  id: string | number,
  auth: AuthHeaders,
): Promise<AxiosResponse<OfficeOrganization[]>> => {
  return API.get<OfficeOrganizationDTO[]>(
    `/v1/dealer/sales-office-organizations/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({
    ...response,
    data: response.data.map(organizationMapper),
  }));
};

const brandMapper = (dto: BrandDTO) => BrandMapper({}, dto);

export const getOfficeBrands = (id: string | number, auth: AuthHeaders): Promise<AxiosResponse<Brand[]>> => {
  return API.get<BrandDTO[]>(
    `/v1/dealer/sales-office-brands/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({
    ...response,
    data: response.data.map(brandMapper),
  }));
};
