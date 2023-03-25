import axios, { AxiosPromise } from 'axios';
import { DADATA_TOKEN, DADATA_URL } from '../config';
import { DadataSuggestAddressDTO } from '../types/dtos/DadataSuggestAddressDTO';
import { DadataSuggestPartyDTO } from '../types/dtos/DadataSuggestPartyDTO';

const DADATA_AUTH = {
  headers: {
    Authorization: `Token ${DADATA_TOKEN}`,
  },
};

export function getAddressSuggestion(query: string): AxiosPromise<DadataSuggestAddressDTO> {
  const url = `${DADATA_URL}/suggest/address`;

  return axios.post(
    url,
    {
      query,
    },
    DADATA_AUTH,
  );
}

export function getPartySuggestion(query: string): AxiosPromise<DadataSuggestPartyDTO> {
  const url = `${DADATA_URL}/suggest/party`;

  return axios.post(
    url,
    {
      query,
    },
    DADATA_AUTH,
  );
}
