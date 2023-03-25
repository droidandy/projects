import API, { CancellableAxiosPromise } from 'api/request';

function resetPasswordByEmail(token: string, password: string, passwordConfirm: string): CancellableAxiosPromise<void> {
  return API.post('/user/password-reset/email', {
    token,
    password,
    passwordConfirm,
  });
}

export { resetPasswordByEmail };
