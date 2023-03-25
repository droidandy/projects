import { AxiosResponse } from 'axios';
import { VehicleImportLogItem, VEHICLE_TYPE, ImportFeed, ImportFeedInput } from '@marketplace/ui-kit/types';
import API, { DIR_URL } from '../config';
import { ImportFeedDTO, VehicleImportLogItemDTO } from '../types/dtos/vehicleImport.dto';
import { VehicleImportFeedMapper, VehicleImportLogItemMapper } from './mappers/vehicleImport.mapper';
import { AuthHeaders } from '../utils/authHelpers';

const logItemMapper = (dto: VehicleImportLogItemDTO) => VehicleImportLogItemMapper({}, dto);

export const getVehicleImportLog = (auth: AuthHeaders): Promise<AxiosResponse<VehicleImportLogItem[]>> => {
  return API.get<VehicleImportLogItemDTO[]>(
    '/v1/vehicle/import-log',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: response.data.map(logItemMapper) }));
};

export const getImportFeed = (
  auth: AuthHeaders,
  vehicleType: VEHICLE_TYPE,
): Promise<AxiosResponse<ImportFeed | null>> =>
  API.get<ImportFeedDTO | null>(
    `/v1/vehicle/import-feed/${vehicleType}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: response.data ? VehicleImportFeedMapper({}, response.data) : null }));

export const addImportFeed = (
  auth: AuthHeaders,
  vehicleType: VEHICLE_TYPE,
  feed: ImportFeedInput,
): Promise<AxiosResponse<void>> =>
  API.post(`/v1/vehicle/import-feed/${vehicleType}`, feed, {
    headers: auth,
    baseURL: DIR_URL,
  });

export const deleteImportFeed = (auth: AuthHeaders, vehicleType: VEHICLE_TYPE): Promise<AxiosResponse<void>> =>
  API.delete(
    `/v1/vehicle/import-feed/${vehicleType}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
