import API, { CancellableAxiosPromise } from 'api/request';

function requestVerifyEmail(): CancellableAxiosPromise<void> {
  return API.post('/user/email/request-confirm', null, { authRequired: true });
}

export { requestVerifyEmail };
