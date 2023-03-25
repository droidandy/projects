import { AxiosResponse } from 'axios';
import {
  CatalogBrandsShort,
  VEHICLE_TYPE,
  VehiclesFilterData,
  VehiclesFilterParams,
  VehiclesMetaData,
} from '@marketplace/ui-kit/types';
import { CatalogBrandsShortDTO, FilterDataDTO } from 'types/dtos/catalog.dto';
import { InstalmentItemMapper } from './mappers/instalment.mapper';
import { VehicleInstalmentItemDTO } from '../types/dtos/instalment.dto';
import API, { DIR_URL } from '../config';
import { VehicleInstalmentItem, VehicleInstalmentListItem } from '../types/vehicle';
import { filterDataMapper } from './catalog';
import { CatalogBrandsShortMapper } from './mappers/catalog.mapper';

type Query = {
  sort?: {
    [key: string]: string;
  };
  [key: string]: any;
};

export const getInstalmentsList = async (params: any): Promise<VehicleInstalmentListItem[]> => {
  const query: Query = {
    ...params,
  };
  if (query.sort) {
    const key = Object.keys(query.sort)[0];
    query[`sort[${key}]`] = query.sort[key];
    delete query.sort;
  }
  return API.get<VehicleInstalmentListItem[]>('/v1/vehicles-installment', query, {
    baseURL: DIR_URL,
  }).then((res) => res.data);
};

export const getInstalmentItem = (
  brand: string,
  model: string,
  id: string | number,
): Promise<VehicleInstalmentItem> => {
  return API.get<VehicleInstalmentItemDTO>(
    `/v1/vehicles-installment/${brand}/${model}/${id}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((res) => InstalmentItemMapper(res.data));
};

export const getBestInstalmentOffers = (params: any): Promise<VehicleInstalmentListItem[]> => {
  return API.get<VehicleInstalmentListItem[]>(
    '/v1/vehicles-installment/best-offers',
    { ...params },
    {
      baseURL: DIR_URL,
    },
  ).then((res) => res.data);
};

export const getInstalmentsSimilar = (id: string): Promise<VehicleInstalmentListItem[]> => {
  return API.get<VehicleInstalmentListItem[]>(
    `/v1/vehicles-installment/similar/${id}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((res) => res.data);
};
export const getInstalmentsMeta = async (
  props: any,
): Promise<AxiosResponse<Omit<VehiclesMetaData, 'vehiclesCount'>>> => {
  return API.get<Omit<VehiclesMetaData, 'vehiclesCount'>>('/v1/vehicles-installment/meta', props, {
    baseURL: DIR_URL,
  });
};

export const getFilterData = (params: VehiclesFilterParams): Promise<VehiclesFilterData> => {
  return API.get<FilterDataDTO>('/v1/vehicles-installment/data-for-filters', params, {
    baseURL: DIR_URL,
  }).then((response) => filterDataMapper(response.data));
};

export const getBrandsShort = (type: VEHICLE_TYPE, params: any): Promise<CatalogBrandsShort[]> => {
  return API.get<CatalogBrandsShort[]>(
    '/v1/vehicles-installment/brands',
    { type, ...params },
    {
      baseURL: DIR_URL,
    },
  ).then((response) => response.data);
};
