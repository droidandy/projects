import API, { CancellableAxiosPromise } from 'api/request';
import { ParsedUrlQuery } from 'querystring';

function generateInstalmentPdf(params: Record<any, any> | ParsedUrlQuery): CancellableAxiosPromise<string> {
  return API.get('pdf/instalment/generate', params, {
    responseType: 'arraybuffer',
  });
}

export { generateInstalmentPdf };
