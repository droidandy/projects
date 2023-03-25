import { FetchQueryOptions, useQuery, useQueryClient } from 'react-query';
import { VehicleType } from 'types/Service';
import {
  getCarBrand,
  getCarModel,
  getCarYears,
  getMapServices,
  getReviews,
  getSuggestedWorkTypes,
  mapSearch,
  getReviewsById,
  getService,
} from 'api/remont';

export const useMapSearch = (data: any, options?: FetchQueryOptions) => {
  return useQuery(['services', data], () => mapSearch(data), { refetchOnMount: true, ...options });
};

export const useCarBrand = (type: VehicleType, options?: FetchQueryOptions) => {
  return useQuery(['brands', { type }], () => getCarBrand(type), { refetchOnMount: true, ...options });
};

export const useCarModel = (brandId: number, options?: { enabled: boolean }) => {
  return useQuery(['models', { brandId }], () => getCarModel(brandId), { refetchOnMount: true, ...options });
};

export const useCarYears = (modelId: number, options?: { enabled: boolean }) => {
  return useQuery(['years', { modelId }], () => getCarYears(modelId), { refetchOnMount: true, ...options });
};

export const useMapServices = (params: any, options?: FetchQueryOptions) => {
  return useQuery(['services', params], () => getMapServices(params), { refetchOnMount: true, ...options });
};

export const useReviews = (options?: FetchQueryOptions) => {
  return useQuery(['reviews'], getReviews, { refetchOnMount: true, ...options });
};

export const useWorkTypes = () => {
  const queryClient = useQueryClient();
  return async (query: string) => {
    let workTypes = [
      { id: 71, part: 'Замена масла в двигателе' },
      { id: 58, part: 'Замена воздушного фильтра' },
      { id: 40, part: 'Шиномонтаж' },
      { id: 319, part: 'Замена тормозных колодок' },
      { id: 392, part: 'Покраска бампера' },
    ];

    if (query.length) {
      const rawData = await queryClient.fetchQuery(['workTypes'], () => getSuggestedWorkTypes(query));
      workTypes = (rawData as any)?.data.items || [];
    }

    return workTypes.map((workType: { part: string; id: number }) => ({
      label: workType.part,
      value: workType.id,
    }));
  };
};

export const useReviewsById = (id: number | string, options?: FetchQueryOptions) => {
  return useQuery(['reviews', id], () => getReviewsById(id), { refetchOnMount: true, ...options });
};

export const useService = (serviceId: number | string, options?: FetchQueryOptions) => {
  return useQuery(['services', serviceId], () => getService(serviceId), { refetchOnMount: true, ...options });
};
