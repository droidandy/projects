import axios, { AxiosPromise } from 'axios';

import { TokenDTO } from '../types/dtos/token.dto';
import { USER_URL, SERVER_AUTH_PASSWORD } from '../config';
import { TokenGrantType } from '../types/TokenGrantType';

export function refreshToken(token: string, clientId: string): AxiosPromise<TokenDTO> {
  const url = `${USER_URL}/oauth2/token/refresh`;

  return axios.post(
    url,
    {
      refresh_token: token,
      grant_type: TokenGrantType.REFRESH_TOKEN,
    },
    {
      auth: {
        username: clientId,
        password: SERVER_AUTH_PASSWORD,
      },
    },
  );
}

/**
 * @TODO: Deprecated, should be removed when fully move to OKP auth
 */
export function loginBySms(phone: string, code: string): AxiosPromise<TokenDTO> {
  const url = `${USER_URL}/user/phone/auth/code-verification`;

  return axios.post(url, {
    phone,
    code,
  });
}

export function login(username: string, password: string, clientId: string): AxiosPromise<TokenDTO> {
  const url = `${USER_URL}/oauth2/token`;

  return axios.post(
    url,
    {
      username,
      password,
      grant_type: TokenGrantType.PASSWORD,
    },
    {
      auth: {
        username: clientId,
        password: SERVER_AUTH_PASSWORD,
      },
    },
  );
}

export function getAuthSms(phone: string): AxiosPromise<TokenDTO> {
  const url = `${USER_URL}/v1/user/phone/auth`;

  return axios.post(url, {
    phone,
  });
}

export function resendAuthSms(token: string) {
  const url = `${USER_URL}/v1/user/phone/auth/code-resend`;

  return axios.post(url, {
    token,
  });
}

export function loginBySmsCode(
  phone: string,
  code: string,
  confirmationToken: string,
  clientId: string,
): AxiosPromise<TokenDTO> {
  const url = `${USER_URL}/v1/user/phone/auth/code-verification`;

  console.log('jeje', url);

  const params = {
    phone,
    code,
    confirmation_token: confirmationToken,
    grant_type: 'third_party_service',
  };

  const auth = {
    username: clientId || 'application.marketplace',
    password: SERVER_AUTH_PASSWORD,
  };

  return axios.post(url, params, {
    auth,
  });
}
