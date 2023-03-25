import { AxiosResponse } from 'axios';
import { Partner } from '@marketplace/ui-kit/types';
import API, { DIR_URL } from '../config';
import { AuthHeaders } from '../utils/authHelpers';
import { DealerPartnersDTO } from '../types/dtos/dealerPartnersDTO';
import { PartnerMapper } from './mappers/dealerPartners.mapper';

const partnersMapper = (dto: DealerPartnersDTO) => PartnerMapper({}, dto);

export const getPartners = async (auth: AuthHeaders): Promise<AxiosResponse<Partner[]>> => {
  const response = await API.get<DealerPartnersDTO[]>(
    '/v1/partners',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );

  return {
    ...response,
    data: response.data.map(partnersMapper),
  };
};
