import { cookies } from './cookies';

const AUTH_TOKEN_COOKIE = 'session_token';
const AUTH_TOKEN_OKP_COOKIE = 'sessionToken';
const CONFIRMATION_TOKEN_COOKIE = 'confirmation_token';
const IMPERSONALIZATION_COOKIE = 'is_impersonalization';

export const getCookieAuthToken = () => {
  return cookies.get(AUTH_TOKEN_COOKIE) || null;
};

export const setCookieAuthToken = (token: string, expiresIn: number) => {
  const expires = new Date(Date.now() + expiresIn * 1000);
  cookies.set(AUTH_TOKEN_COOKIE, token, { path: '/', expires });
};

export const clearCookieAuthToken = () => {
  cookies.remove(AUTH_TOKEN_COOKIE, { path: '/' });
  cookies.remove(AUTH_TOKEN_OKP_COOKIE, { path: '/' });
};

export const getCookieConfirmationToken = () => {
  return cookies.get(CONFIRMATION_TOKEN_COOKIE) || null;
};

export const setCookieConfirmationToken = (token: string, retryTimeout: number) => {
  const expires = new Date(Date.now() + retryTimeout * 1000);
  cookies.set(CONFIRMATION_TOKEN_COOKIE, token, { path: '/', expires });
};

export const getCookieImpersonalization = () => {
  return cookies.get(IMPERSONALIZATION_COOKIE) || null;
};

export const setCookieImpersonalization = () => {
  const expires = new Date(Date.now() + 1800 * 1000);
  cookies.set(IMPERSONALIZATION_COOKIE, true, { path: '/', expires });
};

export const clearCookieImpersonalization = () => {
  cookies.remove(IMPERSONALIZATION_COOKIE, { path: '/' });
};
