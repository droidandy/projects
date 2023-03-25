import API, { CancellableAxiosPromise } from 'api/request';

function getQrCode(url: string): CancellableAxiosPromise<string> {
  return API.get('pdf/get-qr-code', { url });
}

export { getQrCode };
