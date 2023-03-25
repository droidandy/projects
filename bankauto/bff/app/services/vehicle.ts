import { AxiosResponse } from 'axios';
import { VEHICLE_SCENARIO } from '@marketplace/ui-kit/types/Enum';
import { VehicleNew, VehicleShort } from '@marketplace/ui-kit/types/NewVehicle';
import { Vehicle, VehicleCount } from '@marketplace/ui-kit/types/Vehicle';
import { VehiclesMetaData } from '@marketplace/ui-kit/types/VehiclesMetaData';
import { CreateVehicleOptionGroup, CreateVehicleOptions } from '@marketplace/ui-kit/types/VehicleCreateData';
import { VehicleDTONew, VehicleDTOShort } from '../types/dtos/newVehicle.dto';
import { VehicleMapperNew, VehicleMapperShort } from './mappers/newVehicle.mapper';
import { AuthHeaders } from '../utils/authHelpers';
import { GiftDTO } from '../types/dtos/node.dto';
import { VehicleDTO } from '../types/dtos/vehicle.dto';
import API, { DIR_URL } from '../config';
import { VehicleMapper } from './mappers/vehicle.mapper';

const mapper = (dto: VehicleDTO): Vehicle => VehicleMapper({}, dto);
const mapperNew = (dto: VehicleDTONew): VehicleNew => VehicleMapperNew({}, dto);
const mapperShort = (dto: VehicleDTOShort): VehicleShort => VehicleMapperShort({}, dto);

export const getVehicle = (id: string | number): Promise<AxiosResponse<Vehicle>> => {
  return API.get<VehicleDTO>(
    `/v1/vehicle/vehicle/${id}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: mapper(response.data) }));
};

// deprecated
export const getVehicleItem = (brand: string, model: string, id: string | number): Promise<AxiosResponse<Vehicle>> => {
  return API.get<VehicleDTO>(
    `/v1/vehicle/vehicle/${brand}/${model}/${id}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: mapper(response.data) }));
};

export const getVehicleItemNew = (
  brand: string,
  model: string,
  id: string | number,
): Promise<AxiosResponse<VehicleNew>> => {
  return API.get<VehicleDTONew>(
    `/v1/vehicles/${brand}/${model}/${id}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response, data: mapperNew(response.data) };
  });
};

export const getVehicleItemColor = (id: string | number): Promise<AxiosResponse> =>
  API.get(
    `/v1/vehicle/extend/colors/${id}`,
    {},
    {
      baseURL: DIR_URL,
    },
  );

type Query = {
  sort?: {
    [key: string]: string;
  };
  [key: string]: any;
};

// deprecated
export const getVehiclesTypeList = (type: string, props: any): Promise<AxiosResponse<Vehicle[]>> => {
  const query: Query = {
    ...props,
  };
  if (query.sort) {
    const key = Object.keys(query.sort)[0];
    query[`sort[${key}]`] = query.sort[key];
    delete query.sort;
  }
  return API.get<VehicleDTO[]>(`/v1/vehicle/vehicles/${type}`, query, {
    baseURL: DIR_URL,
  }).then((response) => {
    return { ...response, data: response.data.map(mapper) };
  });
};

// deprecated
export const getVehiclesList = async (params: any): Promise<AxiosResponse<Vehicle[]>> => {
  const query: Query = {
    ...params,
  };
  if (query.sort) {
    const key = Object.keys(query.sort)[0];
    query[`sort[${key}]`] = query.sort[key];
    delete query.sort;
  }
  return API.get<VehicleDTO[]>('/v1/vehicle/vehicles', query, {
    baseURL: DIR_URL,
  }).then((response) => {
    return {
      ...response,
      data: response.data.map(mapper),
    };
  });
};

export const getVehiclesListShort = async (params: any): Promise<AxiosResponse<VehicleShort[]>> => {
  const query: Query = {
    ...params,
  };

  if (query.sort) {
    const key = Object.keys(query.sort)[0];
    query[`sort[${key}]`] = query.sort[key];
    delete query.sort;
  }

  return API.get<VehicleDTOShort[]>('/v1/vehicles', query, {
    baseURL: DIR_URL,
  }).then((response) => {
    return {
      ...response,
      data: response.data.map(mapperShort),
    };
  });
};

// deprecated
export const getVehiclesTypeCount = (type: string, props: any): Promise<AxiosResponse<VehicleCount>> => {
  return API.get<VehicleCount>(`/v1/vehicle/vehicles/${type}/count`, props, {
    baseURL: DIR_URL,
  });
};

export const getVehiclesCount = (props: any): Promise<AxiosResponse<VehicleCount>> => {
  return API.get<VehicleCount>('/v1/vehicle/vehicles/count', props, {
    baseURL: DIR_URL,
  });
};

export const getVehiclesMeta = async (props: any): Promise<AxiosResponse<VehiclesMetaData>> => {
  return API.get<VehiclesMetaData>('/v1/vehicles/meta', props, {
    baseURL: DIR_URL,
  });
};

// deprecated
export const getVehiclesSimilar = (id: string): Promise<AxiosResponse<Vehicle[]>> => {
  return API.get<VehicleDTO[]>(
    `/v1/vehicle/vehicles/similar/${id}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: response.data.map(mapper) }));
};

export const getVehiclesSimilarShort = (
  id: string,
  params: Record<string, any>,
): Promise<AxiosResponse<VehicleShort[]>> => {
  return API.get<VehicleDTOShort[]>(`/v1/vehicles/similar/${id}`, params, {
    baseURL: DIR_URL,
  }).then((response) => ({ ...response, data: response.data.map(mapperShort) }));
};
//deprecated
export const getAutotekaLink = (id: string): Promise<AxiosResponse<{ url: string }>> => {
  return API.get<{ url: string }>(
    `/v1/vehicle/autoteka/${id}`,
    {},
    {
      baseURL: DIR_URL,
    },
  );
};

export const getVehicleCreateData = (props: any): Promise<AxiosResponse> => {
  return API.get('/v1/vehicle/catalog/data-for-sale', props, {
    baseURL: DIR_URL,
  });
};

export const getVehicleStickersData = (): Promise<AxiosResponse> => {
  return API.get(
    '/v1/vehicle/stickers-data',
    {},
    {
      baseURL: DIR_URL,
    },
  );
};

export const getVehicleCreateOptions = (props: any): Promise<AxiosResponse<CreateVehicleOptions>> => {
  return API.get<CreateVehicleOptionGroup[]>('/v1/catalog/c2c-options/list', props, {
    baseURL: DIR_URL,
  }).then((response) => {
    return {
      ...response,
      data: { optionGroups: response.data },
    };
  });
};

export const createVehicle = (
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<{ id: number }>> => {
  return API.post<any & { vehicle: Pick<VehicleDTO, 'id'> }>(
    '/v1/vehicle/create',
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    if (response.data.status === 'error' || response.data.errors?.length) {
      throw new Error(response.data.errors.join('; '));
    }
    const id = response.data.vehicle?.id;
    if (!id) {
      throw new Error("Can't get created vehicle ID");
    }
    return { ...response, data: { id } };
  });
};

export const createVehicleTradeIn = (
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<{ id: number }>> => {
  return API.post<any & { vehicle: Pick<VehicleDTO, 'id'> }>(
    '/v1/vehicle/create6',
    { ...params, scenario: VEHICLE_SCENARIO.USED_TRADE_IN },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    if (response.data.status === 'error' || response.data.errors?.length) {
      throw new Error(response.data.errors.join('; '));
    }
    const id = response.data.vehicle?.id;
    if (!id) {
      throw new Error("Can't get created vehicle ID");
    }
    return { ...response, data: { id } };
  });
};

export const getVehicleGifts = (ids: number[], auth: AuthHeaders): Promise<AxiosResponse<GiftDTO[]>> => {
  return API.get<GiftDTO[]>(
    '/v1/vehicle/gifts',
    { id: ids },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({
    ...response,
  }));
};

export const getVehiclesBySpecialProgram = (id: string): Promise<AxiosResponse<VehicleNew[]>> => {
  return API.get<VehicleDTONew[]>(
    `/v1/vehicles/special-offer/${id}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: response.data.map(mapperNew) }));
};

// deprecated
export const getBestOffers = (type: string | number): Promise<AxiosResponse<Vehicle[]>> => {
  return API.get<VehicleDTO[]>(
    `/v1/vehicle/vehicles/best-offers/${type}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: response.data.map(mapper) }));
};

export const getBestOffersShort = (type: string | number, params: any): Promise<AxiosResponse<VehicleShort[]>> => {
  return API.get<VehicleDTOShort[]>(
    `/v1/vehicles/best-offers/${type}`,
    { ...params },
    {
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: response.data.map(mapperShort) }));
};
