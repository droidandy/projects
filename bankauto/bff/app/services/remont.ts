import { AxiosResponse } from 'axios';
import qs from 'qs';
import API, { DIR_URL } from '../config';
import { AuthHeaders } from '../utils/authHelpers';
import { RemontOrdersMapper, UserAutosMapper } from './mappers/remont.mapper';

export const reviews = (filter: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get('v1/remont/reviews', filter, {
    headers: auth,
    baseURL: DIR_URL,
    paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
  }).then((response) => response);
};

export const reviewsById = (id: number | string, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get(
    `v1/remont/reviews/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => response);
};

export const service = (id: string | number, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get(
    `v1/remont/service/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
      paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
    },
  ).then((response) => response);
};

export const getService = (serviceId: number | string, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get(
    `v1/remont/service/${serviceId}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => response);
};

export const workAutocomplete = (query: string, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get(
    `v1/remont/work-autocomplete/${encodeURI(query)}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
      paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
    },
  ).then((response) => response);
};

export const carBrand = (typeId: string | number, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get(
    `v1/remont/car/brand/${typeId}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
      paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
    },
  ).then((response) => response);
};

export const carModel = (brandId: string | number, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get(
    `v1/remont/car/model/${brandId}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
      paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
    },
  ).then((response) => response);
};

export const carGeneration = (modelId: string | number, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get(
    `v1/remont/car/generation/${modelId}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
      paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
    },
  ).then((response) => response);
};

export const carYears = (modelId: string | number, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get(
    `v1/remont/car/years/${modelId}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
      paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
    },
  ).then((response) => response);
};

export const mapServices = (filter: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get('v1/remont/map/services', filter, {
    headers: auth,
    baseURL: DIR_URL,
    paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
  }).then((response) => response);
};

export const mapSearch = (data: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.post('v1/remont/map/search', data, {
    headers: auth,
    baseURL: DIR_URL,
    paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
  }).then((response) => response);
};

export const orderCreate = (data: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.post('v1/remont/order/create', data, {
    headers: auth,
    baseURL: DIR_URL,
    paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
  }).then((response) => response);
};

export const user = (data: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.post('v1/remont/user', data, {
    headers: auth,
    baseURL: DIR_URL,
    paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
  }).then((response) => response);
};

export const getUser = (phone: string, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get(
    `v1/remont/user/${encodeURI(phone)}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
      paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
    },
  ).then((response) => response);
};

export const orders = (auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get(
    'v1/remont/orders',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
      paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
    },
  ).then((response) => {
    const { data } = response;

    return {
      ...response,
      data: {
        ...data,
        data: RemontOrdersMapper(data.data),
      },
    };
  });
};

export const cancelOrder = (data: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.post('v1/remont/order/canceling', data, {
    headers: auth,
    baseURL: DIR_URL,
    paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
  }).then((response) => {
    return response;
  });
};

export const editOrder = (data: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.post('v1/remont/order/edit', data, {
    headers: auth,
    baseURL: DIR_URL,
    paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
  }).then((response) => {
    return response;
  });
};

export const getUserAuto = (auth: AuthHeaders): Promise<AxiosResponse<any[]>> => {
  return API.get(
    'v1/remont/user/auto',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
      paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { encode: false }),
    },
  ).then((response) => {
    return {
      ...response,
      data: UserAutosMapper(response.data),
    };
  });
};
