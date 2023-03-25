import { SimplePdfDataDTO } from 'dtos/SimplePdfDataDTO';
import API, { CancellableAxiosPromise } from '../request';

function getSimplePdfData(uuid: string): CancellableAxiosPromise<SimplePdfDataDTO> {
  return API.get(
    `pdf/get-simple-data/${uuid}`,
    {},
    {
      authRequired: true,
    },
  );
}

export { getSimplePdfData };
