import API, { CancellableAxiosPromise } from 'api/request';

function checkPasswordResetPhoneCode(phone: string, code: string): CancellableAxiosPromise {
  return API.post('/user/password-reset/phone-check-code', {
    phone,
    code,
  });
}

export { checkPasswordResetPhoneCode };
