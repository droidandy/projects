import API from 'api/request';
import { AxiosResponse } from 'axios';
import { MainPageSectionDTO } from 'containers/Finance/Root/types/MainPageSection';

function getMainPageSections(): Promise<AxiosResponse<MainPageSectionDTO[]>> {
  return API.get('/catalog/banner/main-page-sections');
}

export { getMainPageSections };
