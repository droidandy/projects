import API, { CancellableAxiosPromise } from 'api/request';

function registerUser(
  name: string,
  phone: string,
  password: string,
  passwordConfirm: string,
): CancellableAxiosPromise<void> {
  return API.post('/user/registration', {
    name,
    phone,
    password,
    passwordConfirm,
    clientId: process.env.CLIENT_ID,
  });
}

export { registerUser };
