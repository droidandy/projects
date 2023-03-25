import { AxiosResponse } from 'axios';
import { Seller, Vehicle, VehicleShort } from '@marketplace/ui-kit/types';
import { VehicleWithContacts } from 'types/vehicle';
import { VehicleDTO, VehicleWithContactsDTO } from 'types/dtos/vehicle.dto';
import { VehicleDTOShort, VehicleDraftDTO } from 'types/dtos/newVehicle.dto';
import { SellerInfoDTO } from 'types/dtos/seller.dto';
import API, { APPLICATION_URL, DIR_URL } from '../config';
import { AuthHeaders } from 'utils/authHelpers';
import { VehicleContactsMapper, VehicleMapper } from './mappers/vehicle.mapper';
import { SellerInfoMapper } from './mappers/seller.mappers';
import { VehicleMapperShort } from './mappers/newVehicle.mapper';

const mapper = (dto: VehicleDTO): Vehicle => VehicleMapper({}, dto);
const vehicleWithContactsMapper = (dto: VehicleWithContactsDTO): VehicleWithContacts => ({
  vehicle: mapper(dto.vehicle),
  contacts: VehicleContactsMapper({}, dto.contacts).contacts,
});
const sellerMapper = (dto: SellerInfoDTO): Seller => SellerInfoMapper(dto);
const shortMapper = (dto: VehicleDTOShort) => VehicleMapperShort({}, dto);
export const getClientVehicle = (id: string | number, auth: AuthHeaders): Promise<AxiosResponse<Vehicle>> => {
  return API.get<VehicleDTO>(
    `/v1/client/vehicles/vehicle/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response, data: mapper(response.data) };
  });
};

export const getClientVehicleExt = (
  id: string | number,
  auth: AuthHeaders,
): Promise<AxiosResponse<VehicleWithContacts>> => {
  console.debug('do request');
  return API.get<VehicleWithContactsDTO>(
    `/v1/client/vehicles/vehicle-ext/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    console.debug(response.data);
    return { ...response, data: vehicleWithContactsMapper(response.data) };
  });
};

export const getClientVehicles = (auth: AuthHeaders): Promise<AxiosResponse<Vehicle[]>> => {
  return API.get<VehicleDTO[]>(
    '/v1/client/vehicles',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response, data: response.data.map(mapper) };
  });
};

export const getClientAds = (auth: AuthHeaders, params: Record<string, any>): Promise<AxiosResponse<Vehicle[]>> => {
  return API.get<VehicleDTO[]>(
    '/v1/client/vehicles/ads',
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response, data: response.data.map(mapper) };
  });
};

export const getClientAdsCount = (auth: AuthHeaders): Promise<AxiosResponse<{ count: number }>> => {
  return API.get<{ count: number }>(
    '/v1/client/vehicles/ads-count',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response, data: response.data };
  });
};

export const createClientVehicle = (
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<{ id: string }>> => {
  return API.post<any & { vehicle: { id: string } }>(
    '/v1/client/vehicles/vehicle',
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    if (response.data.status === 'error' || response.data.errors?.length) {
      throw new Error(response.data.errors.join('; '));
    }
    return { ...response, data: { id: response.data.vehicle.id } };
  });
};

export const createClientVehicleExt = (
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<{ id: string }>> => {
  return API.post<any & { vehicle: { id: string } }>(
    '/v1/client/vehicles/vehicle-ext',
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    if (response.data.status === 'error' || response.data.errors?.length) {
      if (Array.isArray(response.data.errors)) {
        throw new Error(response.data.errors.join('; '));
      }
      const errorMsg = Object.entries(response.data.errors)
        .map(([fieldName, data]) => `${fieldName}: ${data}`)
        .join('; ');
      throw new Error(errorMsg);
    }
    return { ...response, data: { id: response.data.vehicle.id } };
  });
};

export const updateClientVehicle = (
  id: string,
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<{ id: string }>> => {
  return API.put<{ id: string }>(
    `/v1/client/vehicles/vehicle-ext/${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response, data: { id: response.data.id } };
  });
};

export const deactivateClientVehicle = (
  id: string | number,
  auth: AuthHeaders,
  cancelReason?: number,
): Promise<AxiosResponse<Vehicle>> => {
  return API.put<Vehicle>(
    `/v1/client/vehicles/vehicle/${id}/deactivate`,
    { cancelReason },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: response.data }));
};
export const getClientAllVehicles = (
  ids: string[] | number[],
  auth: AuthHeaders,
): Promise<AxiosResponse<VehicleShort[]>> => {
  return API.get<VehicleDTOShort[]>(
    '/v1/client/vehicles/list',
    { ids },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: response.data.map(shortMapper) }));
};

export const deleteClientVehicle = (id: string | number, auth: AuthHeaders): Promise<AxiosResponse<Vehicle>> => {
  return API.delete<Vehicle>(
    `/v1/client/vehicles/vehicle/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: response.data }));
};

export const getSellerInfo = (id: string | number, auth: AuthHeaders): Promise<AxiosResponse<Seller>> => {
  return API.get<SellerInfoDTO>(
    `/v1/client/vehicles/${id}/seller`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response, data: sellerMapper(response.data) };
  });
};

export const getApplicationsByVehicle = (vehicleId: number | string, auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.get(
    '/v1/client/applications/list',
    { vehicleId },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response, data: response.data };
  });
};

export const setClientInterestedToApplication = (
  applicationId: string | number,
  auth: AuthHeaders,
): Promise<AxiosResponse> => {
  return API.put<void>(
    `/applications/vehicle/c2b/${applicationId}/interested`,
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then((response) => {
    return { ...response };
  });
};

export const createClientVehicleTradeIn = (
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<{ id: number }>> => {
  return API.post<any & { vehicle: Pick<VehicleDTO, 'id'> }>(
    '/v1/client/vehicles/trade-in',
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    if (response.status !== 201 || response.data.errors?.length) {
      throw new Error(response.data.errors.join('; '));
    }

    const { id } = response.data;
    if (!id) {
      throw new Error("Can't get created vehicle ID");
    }
    return { ...response, data: { id } };
  });
};

export const getClientVehicleInfoDraft = (vehicleId: string | number, auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.get<VehicleDraftDTO>(
    `/v1/client/vehicles/draft/${vehicleId}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response };
  });
};

export const makeClientVehicleRelease = (body: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.put<void>(
    '/v1/client/vehicles/draft/release',
    { ...body },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response };
  });
};

export const createClientVehicleDraft = (body: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.post<void>(
    '/v1/client/vehicles/draft',
    { ...body },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response };
  });
};

export const updateClientVehicleDraft = (body: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.put<void>(
    '/v1/client/vehicles/draft',
    { ...body },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response };
  });
};

export const createClientVehicleSimpleDraft = (
  body: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse> => {
  return API.post<void>(
    '/v1/client/vehicles/simple-draft',
    { ...body },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response };
  });
};

export const createClientVehicleCallDraft = (body: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.post<void>(
    '/v1/client/vehicles/call-draft',
    { ...body },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response };
  });
};

export const getClientVehicleStatistics = (vehicleId: string, auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.get(
    `/v1/client/vehicles/${vehicleId}/stats`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response }));
};
