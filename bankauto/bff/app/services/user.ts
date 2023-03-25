import { AxiosPromise, AxiosResponse } from 'axios';
import { User } from '@marketplace/ui-kit/types';
import API, { SERVER_AUTH_PASSWORD, USER_URL } from '../config';
import { AuthHeaders } from '../utils/authHelpers';
import { UserDTO } from '../types/dtos/user.dto';
import { TokenDTO } from '../types/dtos/token.dto';
import { UserMapper } from './mappers/user.mapper';
import { passwordConfirmMapper, passwordResetMapper } from './mappers/password';

const mapper = (dto: UserDTO) => UserMapper({}, dto);

export const getProfile = (auth: AuthHeaders): Promise<AxiosResponse<User>> => {
  return API.get<UserDTO>(
    '/users/me',
    {},
    {
      headers: auth,
      baseURL: USER_URL,
    },
  ).then((response) => ({ ...response, data: mapper(response.data) }));
};

export const getUsers = (filter: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse<User[]>> => {
  return API.get<{ data: UserDTO[] }>(
    '/users',
    { ...filter },
    {
      headers: auth,
      baseURL: USER_URL,
    },
  ).then((response) => {
    return { ...response, data: response.data.data.map(mapper) };
  });
};

export const getUser = (id: string | number, auth: AuthHeaders): Promise<AxiosResponse<User[]>> => {
  return API.get<UserDTO[]>(
    `/users/${id}`,
    {},
    {
      headers: auth,
      baseURL: USER_URL,
    },
  ).then((response) => ({ ...response, data: response.data.map(mapper) }));
};

export function registerUser(
  name: string,
  phone: string,
  password: string,
  passwordConfirm: string,
  clientId: string,
): AxiosPromise<void> {
  const url = '/registration';

  return API.post(
    url,
    {
      first_name: name,
      phone,
      password,
      password_confirm: passwordConfirm,
    },
    {
      auth: {
        username: clientId,
        password: SERVER_AUTH_PASSWORD,
      },
      baseURL: USER_URL,
    },
  ).catch(passwordConfirmMapper);
}

export function checkIsRegisteredUser(
  firstName: string,
  phone: string,
  lastName: string,
  patronymic: string,
  email: string,
  regType: string,
  meta?: {
    utmSource: string;
    utmContent: string;
    utmMedium: string;
    utmCampaign: string;
    utmTerm: string;
    timestamp: string;
    clientId: string;
  },
): AxiosPromise<void> {
  const url = '/registration/without-confirmation';
  return API.post(
    url,
    {
      phone,
      email,
      first_name: firstName,
      last_name: lastName,
      patronymic_name: patronymic,
      registration_application_type: regType,
      ...(meta
        ? {
            meta: {
              ...meta,
              utm_source: meta.utmSource,
              utm_content: meta.utmContent,
              utm_medium: meta.utmMedium,
              utm_campaign: meta.utmCampaign,
              utm_term: meta.utmTerm,
              client_id: meta.clientId,
            },
          }
        : {}),
    },
    {
      baseURL: USER_URL,
    },
  );
}

export function quickRegister(
  firstName: string,
  phone: string,
  lastName: string,
  patronymicName: string,
  clientId: string,
  meta?: {
    utmSource: string;
    utmContent: string;
    utmMedium: string;
    utmCampaign: string;
    utmTerm: string;
    timestamp: string;
    clientId: string;
  },
): AxiosPromise<void> {
  const url = '/registration/quick';

  return API.post(
    url,
    {
      first_name: firstName,
      last_name: lastName,
      patronymic_name: patronymicName,
      phone,
      ...(meta
        ? {
            meta: {
              ...meta,
              utm_source: meta.utmSource,
              utm_content: meta.utmContent,
              utm_medium: meta.utmMedium,
              utm_campaign: meta.utmCampaign,
              utm_term: meta.utmTerm,
              client_id: meta.clientId,
            },
          }
        : {}),
    },
    {
      auth: {
        username: clientId,
        password: SERVER_AUTH_PASSWORD,
      },
      baseURL: USER_URL,
    },
  ).catch();
}

export function registerUserByPhone(
  name: string,
  email: string,
  auth: AuthHeaders,
  regType: string,
  cityId: number,
  consentTo: number,
  meta?: {
    utmSource: string;
    utmContent: string;
    utmMedium: string;
    utmCampaign: string;
    utmTerm: string;
    timestamp: string;
    clientId: string;
  },
): AxiosPromise<void> {
  const url = '/user/phone/registration';

  return API.post(
    url,
    {
      first_name: name,
      email,
      city_id: cityId,
      consent_to: consentTo,
      registration_application_type: regType,
      ...(meta
        ? {
            meta: {
              ...meta,
              utm_source: meta.utmSource,
              utm_content: meta.utmContent,
              utm_medium: meta.utmMedium,
              utm_campaign: meta.utmCampaign,
              utm_term: meta.utmTerm,
              client_id: meta.clientId,
            },
          }
        : {}),
    },
    {
      headers: auth,
      baseURL: USER_URL,
    },
  );
}

export function requestPasswordReset(email?: string, phone?: string): AxiosPromise<void> {
  const url = email ? `${USER_URL}/password/request-reset` : `${USER_URL}/password/request-reset/phone`;
  const params = email ? { email } : { phone };

  return API.post(url, params, {
    baseURL: USER_URL,
  }).catch(passwordResetMapper(email, phone));
}

export function passwordResetByEmail(token: string, password: string, passwordConfirm: string): AxiosPromise<any> {
  const url = '/password/reset';

  return API.post(
    url,
    {
      token,
      password,
      password_confirm: passwordConfirm,
    },
    {
      baseURL: USER_URL,
    },
  )
    .then((response) => {
      return response;
    })
    .catch(passwordConfirmMapper);
}

export function passwordResetByPhone(
  phone?: string,
  code?: string,
  password?: string,
  passwordConfirm?: string,
): AxiosPromise<void> {
  const url = '/password/reset/phone';

  return API.post(
    url,
    {
      phone,
      code,
      password,
      password_confirm: passwordConfirm,
    },
    {
      baseURL: USER_URL,
    },
  ).catch(passwordConfirmMapper);
}

export const changePassword = (params: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.post(
    '/users/password/change',
    { ...params },
    {
      headers: auth,
      baseURL: USER_URL,
    },
  );
};

export const verifyEmail = (params: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.post(
    '/verify/email',
    { ...params },
    {
      headers: auth,
      baseURL: USER_URL,
    },
  );
};

export const verifyPhone = (params: Record<string, any>): Promise<AxiosResponse<TokenDTO>> => {
  return API.post(
    '/verify/phone',
    { ...params },
    {
      baseURL: USER_URL,
    },
  );
};

export const sendVerifyPhoneCode = (params: Record<string, any>): Promise<AxiosResponse> => {
  return API.post(
    '/verify/phone/request-code',
    { ...params },
    {
      baseURL: USER_URL,
    },
  );
};

export const requestVerifyEmail = (auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.post(
    '/email/request-confirm',
    {},
    {
      headers: auth,
      baseURL: USER_URL,
    },
  );
};

export const updateProfile = (params: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse<User>> => {
  return API.put(
    '/users/profile',
    { ...params },
    {
      headers: auth,
      baseURL: USER_URL,
    },
  ).then((response) => {
    return { ...response, data: mapper(response.data) };
  });
};

export const checkPasswordResetPhoneCode = (params: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.post(
    '/password/reset/phone-check-code',
    { ...params },
    {
      headers: auth,
      baseURL: USER_URL,
    },
  );
};

export const updateLeadSource = (
  leadSourceInfo: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_term: string;
    utm_content: string;
    client_id: string;
    timestamp: string;
    user_uuid: string;
  },
  auth: AuthHeaders,
): Promise<AxiosResponse> => {
  return API.post('/analytics/user/utm', leadSourceInfo, {
    headers: auth,
    baseURL: USER_URL,
  });
};

export const setEmail = (params: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse> => {
  return API.put('/users/email/change', params, {
    headers: auth,
    baseURL: USER_URL,
  });
};
export const validateResetTokenByEmail = (token: string): Promise<AxiosResponse> => {
  return API.post(
    '/password/reset/validate-token',
    { token },
    {
      baseURL: USER_URL,
    },
  );
};
