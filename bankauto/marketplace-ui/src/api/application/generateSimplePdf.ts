import API, { CancellableAxiosPromise } from 'api/request';
import { ParsedUrlQuery } from 'querystring';

function generateSimplePdf(params: Record<any, any> | ParsedUrlQuery): CancellableAxiosPromise<string> {
  return API.get('pdf/simple/generate', params, {
    responseType: 'arraybuffer',
  });
}

export { generateSimplePdf };
