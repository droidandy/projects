import API, { CancellableAxiosPromise } from 'api/request';
import { AutostatByParamsData, AutostatParamsAccurate } from 'types/Autostat';
import { AxiosResponse } from 'axios';

export interface AutostatByParamsResponseDTO {
  price: number;
}

type GetAutostatByParamsData = (params: AutostatParamsAccurate) => CancellableAxiosPromise<AutostatByParamsData>;

const getAutostatDataByParams: GetAutostatByParamsData = async (
  params,
): Promise<AxiosResponse<AutostatByParamsData>> => {
  return API.get<AutostatByParamsResponseDTO>('/autostat/price-by-params', params, { ignoreFlashMessage: true });
};

export { getAutostatDataByParams };
