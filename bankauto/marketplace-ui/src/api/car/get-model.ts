import { AxiosResponse } from 'axios';
import API from 'api/request';
import { VEHICLE_TYPE, CatalogModel } from '@marketplace/ui-kit/types';

const getModel = async (type: VEHICLE_TYPE, modelId: string | number): Promise<AxiosResponse<CatalogModel>> => {
  return API.get(`/catalog/model/${type}/${modelId}`);
};

export { getModel };
