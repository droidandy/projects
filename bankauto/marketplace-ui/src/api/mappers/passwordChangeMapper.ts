import { AxiosError, AxiosPromise } from 'axios';

// TODO: вынести в дальнейшем на уровень выше, чтоб переиспользовать и в back и в front
function passwordChangeMapper(error: AxiosError): AxiosPromise<void> {
  const passwordConfirm = error?.response?.data?.detail?.password_confirm;
  const passwordCurrent = error?.response?.data?.detail?.current_password;

  if (passwordCurrent && error.response) {
    error.response.data.detail.currentPassword = error.response.data.detail.current_password;
    delete error.response.data.detail.current_password;
  }

  if (passwordConfirm && error.response) {
    error.response.data.detail.passwordConfirm = error.response.data.detail.password_confirm;
    delete error.response.data.detail.password_confirm;
  }

  return Promise.reject(error);
}

export { passwordChangeMapper };
