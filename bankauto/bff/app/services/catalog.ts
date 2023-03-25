import { AxiosResponse } from 'axios';
import {
  CatalogNode,
  Brand,
  CatalogBrand,
  CatalogModel,
  FilterData,
  VehiclesFilterData,
  VehiclesFilterParams,
  CatalogBrandsShort,
  ExchangeRates,
} from '@marketplace/ui-kit/types';
import { City } from 'types/dtos/city.dto';
import API, { DIR_URL } from '../config';
import {
  CatalogBrandDTO,
  CatalogBrandsShortDTO,
  CatalogModelDTO,
  FilterDataDeprecatedDTO,
  FilterDataDTO,
  SeoDTO,
  VehicleMetaDTO,
} from '../types/dtos/catalog.dto';
import { BrandDTO } from '../types/dtos/node.dto';
import {
  CatalogBrandMapper,
  CatalogModelMapper,
  CatalogNodeMapper,
  CatalogBrandsShortMapper,
} from './mappers/catalog.mapper';

import { pipeMapper } from './mappers/utils';
import {
  BodyTypeMapper,
  BrandMapper,
  ColorMapper,
  DriveMapper,
  EngineMapper,
  GenerationMapper,
  ModelMapper,
  TransmissionMapper,
} from './mappers/node.mapper';

// eslint-disable-next-line @typescript-eslint/naming-convention
const mapperDeprecated = ({
  brands,
  models,
  body_types,
  transmissions,
  engines,
  drives,
  colors,
}: FilterDataDeprecatedDTO): FilterData => ({
  brands: brands.map((dto) => BrandMapper({}, dto)),
  models: models.map((dto) => ModelMapper({}, dto)),
  bodyTypes: body_types.map((dto) => BodyTypeMapper({}, dto)),
  transmissions: transmissions.map((dto) => TransmissionMapper({}, dto)),
  engines: engines.map((dto) => EngineMapper({}, dto)),
  drives: drives.map((dto) => DriveMapper({}, dto)),
  colors: colors.map((dto) => ColorMapper({}, dto)),
});

export const filterDataMapper = ({
  brands,
  models,
  generations,
  bodies,
  transmissions,
  engines,
  drives,
  colors,
  volumeFrom,
  volumeTo,
  ...rest
}: FilterDataDTO): VehiclesFilterData => ({
  ...rest,
  volumeFrom: +volumeFrom,
  volumeTo: +volumeTo,
  brands: brands.map((dto: any) => BrandMapper({}, dto)),
  models: models.map((dto: any) => ModelMapper({}, dto)),
  generations: generations.map((dto: any) => GenerationMapper({}, dto)),
  bodyTypes: bodies.map((dto: any) => BodyTypeMapper({}, dto)),
  transmissions: transmissions.map((dto: any) => TransmissionMapper({}, dto)),
  engines: engines.map((dto: any) => EngineMapper({}, dto)),
  drives: drives.map((dto: any) => DriveMapper({}, dto)),
  colors: colors.map((dto: any) => ColorMapper({}, dto)),
});

export const getFilterDataDeprecated = (): Promise<FilterData> => {
  return API.get<FilterDataDeprecatedDTO>(
    '/v1/vehicle/catalog/filter-data',
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => mapperDeprecated(response.data));
};

export const getFilterData = (params: VehiclesFilterParams): Promise<VehiclesFilterData> => {
  return API.get<FilterDataDTO>('v1/vehicles/data-for-filters', params, {
    baseURL: DIR_URL,
  }).then((response) => filterDataMapper(response.data));
};

export const getBrands = (type: string): Promise<(Brand & CatalogNode)[]> => {
  return API.get<(BrandDTO & SeoDTO & VehicleMetaDTO)[]>(
    `/v1/vehicle/catalog/brands/${type}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => response.data.map((dto) => pipeMapper(BrandMapper, CatalogNodeMapper)({}, dto)));
};

export const getBrandsShort = (type: string, params: any): Promise<CatalogBrandsShort[]> => {
  return API.get<CatalogBrandsShortDTO[]>(
    `/v1/catalog/brands/vehicle-${type}`,
    { ...params },
    {
      baseURL: DIR_URL,
    },
  ).then((response) => response.data.map((dto) => CatalogBrandsShortMapper({}, dto)));
};

export const getBrand = (type: string, id: string | number): Promise<CatalogBrand> => {
  return API.get<CatalogBrandDTO>(
    `/v1/vehicle/catalog/${type}/brand/${id}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => CatalogBrandMapper({}, response.data));
};

export const getModel = (type: string, id: string | number): Promise<CatalogModel> => {
  return API.get<CatalogModelDTO>(
    `/v1/vehicle/catalog/${type}/model/${id}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => CatalogModelMapper({}, response.data));
};

export const getExchangeRates = (type: string): Promise<AxiosResponse<ExchangeRates>> => {
  return API.get<AxiosResponse<ExchangeRates>>(
    '/rates',
    { type },
    {
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return response.data;
  });
};

export const getSavingsAccountRates = (): Promise<any[]> => {
  return API.get<any[]>(
    '/v1/savings-account/rates',
    {},
    {
      baseURL: DIR_URL,
    },
  )
    .then((response) => {
      return response.data.map((rate: any) => ({
        id: rate.id,
        amount: rate.amount,
        basicRate: rate.basic_rate,
        higherRate: rate.higher_rate,
        order: rate.order,
      }));
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const getCities = (): Promise<AxiosResponse<{ primary: City[]; secondary: City[] }>> => {
  return API.get<AxiosResponse<{ primary: City[]; secondary: City[] }>>(
    '/v1/cities',
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return response.data;
  });
};

export const checkAlias = (params: {
  brand: string;
  model?: string;
  generation?: string;
}): Promise<AxiosResponse<{}>> => {
  return API.get<AxiosResponse<{}>>('/v1/catalog/alias/check', params, {
    baseURL: DIR_URL,
  }).then((response) => {
    return response.data;
  });
};

type CatalogBrandsParams = {
  type: string;
  cityId?: string[] | null;
  distance?: string;
};

export const getCatalogBrands = ({ type, cityId, distance }: CatalogBrandsParams): Promise<CatalogBrandsShort[]> => {
  return API.get<CatalogBrandsShort[]>(
    `/v1/vehicles/brands${(type && `/${type}`) || ''}`,
    { cityId, distance },
    {
      baseURL: DIR_URL,
    },
  ).then((response) => response.data);
};

export const getFinanceMainPageSections = (): Promise<any[]> => {
  return API.get(
    '/v1/banner/main-page-sections',
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => response.data);
};

export const getFinancePageInfo = (alias: string): Promise<any[]> => {
  return API.get(
    '/v1/banner/list',
    { alias },
    {
      baseURL: DIR_URL,
    },
  ).then((response) => response.data);
};
