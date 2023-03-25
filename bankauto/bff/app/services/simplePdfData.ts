import { AxiosResponse } from 'axios';
import { AuthHeaders } from '../utils/authHelpers';
import API, { DIR_URL } from '../config';
import { SimplePdfDto } from '../types/dtos/simplePdf.dto';

export const getSimpleData = (uuid: string, auth: AuthHeaders): Promise<AxiosResponse<SimplePdfDto>> => {
  return API.get(
    `/v1/client/applications/data-credit/${uuid}`,
    {},
    {
      baseURL: DIR_URL,
      headers: auth,
    },
  );
};
