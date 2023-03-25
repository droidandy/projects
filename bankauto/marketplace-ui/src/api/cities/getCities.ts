import API, { CancellableAxiosPromise } from 'api/request';
import { City } from 'types/City';

export const getCities = (): CancellableAxiosPromise<{ primary: City[]; secondary: City[] }> => {
  return API.get('/catalog/cities', {}, {});
};
