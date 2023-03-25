import { AxiosError } from 'axios';
import API, { CancellableAxiosPromise } from '../request';
import { InspectionVehicle } from 'containers/PersonalArea/Inspections/types';
import { Inspection } from 'types/Inspection';

export const getInspections = (): CancellableAxiosPromise<InspectionVehicle[]> => {
  return API.get<InspectionVehicle[]>(
    '/client/expocar/inspections',
    {},
    {
      authRequired: true,
      ignoreFlashMessage: true,
      errorMessage: (error: AxiosError) =>
        error.response?.data?.error
          ? error.response.data.error.message
          : 'Произошла ошибка. Не удалось получить список автомобилей для проверки.',
    },
  ).then((response) => ({ ...response }));
};

export const removeInspection = (id: number | string): CancellableAxiosPromise => {
  return API.delete(
    `/client/expocar/inspections/remove-item/${id}`,
    {},
    {
      authRequired: true,
      ignoreFlashMessage: true,
      errorMessage: (error: AxiosError) =>
        error.response?.data?.error ? error.response.data.error.message : 'Произошла ошибка. Неудалось удалить.',
    },
  ).then((response) => ({ ...response }));
};

export const createInspection = (vehicleId: number | string): CancellableAxiosPromise<{ orderId: number }> => {
  return API.post<{ orderId: number }>(
    '/client/expocar/inspections/create',
    { vehicleId },
    {
      authRequired: true,
      ignoreFlashMessage: true,
      errorMessage: (error: AxiosError) =>
        error.response?.data?.error ? error.response.data.error.message : 'Произошла ошибка.',
    },
  ).then((response) => ({ ...response }));
};

export const checkPresetnExpocarInCity = (cityId: number | string): CancellableAxiosPromise<{ available: boolean }> => {
  return API.get<{ available: boolean }>(
    `/client/expocar/available-city/${cityId}`,
    {},
    {
      ignoreFlashMessage: true,
    },
  ).then((response) => ({ ...response }));
};

export const getInspectionByVehicleId = (
  vehicleId: number | string,
): CancellableAxiosPromise<{ inspection: Inspection | null }> => {
  return API.get<{ inspection: Inspection | null }>(
    `/client/expocar/inspection-for-vehicle/${vehicleId}`,
    {},
    {
      authRequired: true,
      ignoreFlashMessage: true,
    },
  ).then((response) => ({ ...response }));
};
