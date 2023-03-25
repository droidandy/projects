import API from 'api/request';
import { AxiosResponse } from 'axios';
import { Partners } from '@marketplace/ui-kit/types';

const getPartners = (): Promise<AxiosResponse<Partners>> => API.get('dealer/partner/list');

export { getPartners };
