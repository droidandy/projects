import { AxiosResponse } from 'axios';
import API, { DIR_URL } from '../config';
import { AuthHeaders } from '../utils/authHelpers';
import { InstalmentPdfDto } from '../types/dtos/instalmentPdf.dto';

export const getInstalmentData = (uuid: string, auth: AuthHeaders): Promise<AxiosResponse<InstalmentPdfDto>> => {
  return API.get(
    `/v1/client/applications/data-installment/${uuid}`,
    {},
    {
      baseURL: DIR_URL,
      headers: auth,
    },
  );
};
