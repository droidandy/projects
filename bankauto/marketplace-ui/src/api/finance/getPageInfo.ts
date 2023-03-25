import API from 'api/request';
import { AxiosResponse } from 'axios';
import { PageInfoDTO } from 'containers/Finance/types/PageInfo';

function getPageInfo(alias: string): Promise<AxiosResponse<PageInfoDTO[]>> {
  return API.get('/catalog/banner/list', { alias });
}

export { getPageInfo };
