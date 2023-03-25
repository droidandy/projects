import { AxiosError, AxiosPromise } from 'axios';

export const passwordConfirmMapper = (error: AxiosError): AxiosPromise<void> => {
  const passwordConfirm = error?.response?.data?.detail?.password_confirm;

  if (passwordConfirm && error.response) {
    error.response.data.detail.passwordConfirm = error.response.data.detail.password_confirm;
    delete error.response.data.detail.password_confirm;
  }

  return Promise.reject(error);
};

export const passwordResetMapper =
  (email?: string, phone?: string) =>
  (error: AxiosError): AxiosPromise<void> => {
    const isEmail = email && error.response?.data?.detail?.email;
    const isPhone = phone && error.response?.data?.detail?.phone;

    if (isEmail && error.response) {
      error.response.data.detail.emailOrPhone = error.response.data.detail.email;
      delete error.response.data.detail.email;
    }

    if (isPhone && error.response) {
      error.response.data.detail.emailOrPhone = error.response.data.detail.phone;
      delete error.response.data.detail.phone;
    }

    return Promise.reject(error);
  };

export const passwordChangeMapper = (error: AxiosError): AxiosPromise<void> => {
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
};
