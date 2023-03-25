import { AxiosResponse } from 'axios';
import { AdvertiseList, BDASpecialOffer, SpecialOfferItem } from '@marketplace/ui-kit/types';
import { AdvertiseListDTO, SpecialOfferDTO } from 'types/dtos/banking.dto';
import API, { DIR_URL } from '../config';
import { AdvertiseListMapper, SpecialOfferMapper } from './mappers/banking.mapper';

export const getAdvertiseList = (
  count: number = 4, // eslint-disable-line
  params: Record<string, any>,
): Promise<AxiosResponse<AdvertiseList>> => {
  return API.get<AdvertiseListDTO>(
    `/v1/banking/advertise/latest/${count}`,
    { ...params },
    {
      baseURL: DIR_URL,
    },
  ).then(async (response) => {
    return {
      ...response,
      data: AdvertiseListMapper({
        ...response.data,
        items: response.data.items,
      }),
    };
  });
};

export const getSpecialOffers = (params: Record<string, any>): Promise<AxiosResponse<SpecialOfferItem>> => {
  return API.get<SpecialOfferItem>(
    '/v1/banking/special-offers',
    { ...params },
    {
      baseURL: DIR_URL,
    },
  ).then(async (response) => {
    return response;
  });
};

export const getSpecialOffer = (slug: string): Promise<AxiosResponse<BDASpecialOffer>> => {
  return API.get<SpecialOfferDTO>(`/v1/banking/special-offers/${slug}`, {}, { baseURL: DIR_URL }).then(
    async (response) => {
      return {
        ...response,
        data: SpecialOfferMapper({
          ...response.data,
        }),
      };
    },
  );
};

export const getBusinessRule = (vehicleId: number): Promise<AxiosResponse<any>> => {
  return API.get(
    '/v1/banking/business-rule',
    { vehicleId },
    {
      baseURL: DIR_URL,
    },
  );
};
