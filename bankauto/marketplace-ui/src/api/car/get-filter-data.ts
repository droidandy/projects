import API, { CancellableAxiosPromise } from 'api/request';
import { FilterData } from '@marketplace/ui-kit/types';

function getFilterData(): CancellableAxiosPromise<FilterData> {
  return API.get('/catalog/data');
}

export { getFilterData };
