import API, { CancellableAxiosPromise } from 'api/request';

function resetPasswordByPhone(
  phone: string,
  code: string,
  password: string,
  passwordConfirm: string,
): CancellableAxiosPromise<void> {
  return API.post('/user/password-reset/phone', {
    phone,
    code,
    password,
    passwordConfirm,
  });
}

export { resetPasswordByPhone };
