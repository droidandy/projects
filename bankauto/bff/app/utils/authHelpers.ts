import { Request, Response } from 'express';
import { CURRENT_ENV, ENVS } from '../config';

export interface AuthHeaders {
  Authorization: string;
  'X-Request-Id'?: string;
}
export const getAuthHeaders = (req: Request): AuthHeaders => {
  const { sessionToken } = req.cookies;

  if (req.get('Authorization')) {
    return {
      Authorization: req.get('Authorization') || '',
      'X-Request-Id': req.get('X-Request-Id') || '',
    };
  }

  return {
    Authorization: sessionToken ? `ThirdPartyService ${sessionToken || ''}` : '',
    'X-Request-Id': req.get('X-Request-Id') || '',
  };
};

export const REFRESH_TOKEN_LIFETIME = 1000 * 60 * 60 * 24 * 30;

const getDomain = (res: Response): string | undefined => {
  if (!res.req) {
    return;
  }

  const origin = res.req.header('Origin');
  if (!origin) {
    return;
  }

  const originUrl = new URL(origin);
  const hostnameParts = originUrl.hostname.split('.');
  return hostnameParts.length > 1 // В случае localhost
    ? `.${hostnameParts[hostnameParts.length - 2]}.${hostnameParts[hostnameParts.length - 1]}`
    : hostnameParts[0];
};

export const setAuthTokens = (res: Response, token: string) => {
  const refreshTokenLifeTime = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);
  const domain = getDomain(res);

  res.cookie('subdomainAuth', token, {
    expires: refreshTokenLifeTime,
    httpOnly: true,
    domain,
    secure: CURRENT_ENV === ENVS.PRODUCTION,
    sameSite: 'strict',
  });
};

export const flushAuthTokens = (res: Response) => {
  const domain = getDomain(res);

  res.cookie('sessionToken', '', {
    expires: new Date(),
    secure: CURRENT_ENV === ENVS.PRODUCTION,
    sameSite: 'strict',
    domain,
  });
  res.cookie('subdomainAuth', '', {
    expires: new Date(),
    secure: CURRENT_ENV === ENVS.PRODUCTION,
    sameSite: 'strict',
    domain,
  });
};

export const setConfirmationToken = (res: Response, confirmationToken: string) => {
  const domain = getDomain(res);

  res.cookie('confirmation_token', confirmationToken, {
    expires: new Date(Date.now() + 1000 * 60 * 60),
    httpOnly: true,
    domain,
    secure: CURRENT_ENV === ENVS.PRODUCTION,
    sameSite: 'strict',
  });
};

export const setAccessToken = (res: Response, accessToken: string) => {
  const domain = getDomain(res);

  res.cookie('sessionToken', accessToken, {
    expires: new Date(Date.now() + 1000 * 60 * 60),
    httpOnly: true,
    domain,
    secure: CURRENT_ENV === ENVS.PRODUCTION,
    sameSite: 'strict',
  });
};
