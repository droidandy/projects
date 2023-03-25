import API, { CancellableAxiosPromise } from 'api/request';
import { PartnerCity } from 'types/PartnerCity';

function getPartnerCities(): CancellableAxiosPromise<PartnerCity[]> {
  return API.get<PartnerCity[]>('/lead/cities');
}

export { getPartnerCities };
