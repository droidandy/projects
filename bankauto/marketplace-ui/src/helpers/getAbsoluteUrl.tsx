import { IncomingMessage } from 'http';
import { isSsr } from './isSsr';

export interface AbsoluteUrl {
  protocol: string;
  host: string;
  origin: string;
  fullPath: string;
}

const getAbsoluteUrl = (req?: IncomingMessage) => {
  let protocol = 'https:';
  let host = (req && req.headers['x-forwarded-host']) || (req && req.headers.host!);
  if (!isSsr) {
    host = window.location.host;
  }
  if (host && host.indexOf('localhost') > -1) {
    protocol = 'http:';
  }
  const origin = `${protocol}//${host}`;
  return origin;
};

const getFullPathname = (req?: IncomingMessage) => {
  const origin = getAbsoluteUrl(req);
  let url = req && req.url;
  if (!isSsr) {
    url = window.location.pathname;
  }
  const fullPath = `${origin}${url}`.split('?')[0];
  return fullPath;
};

export { getAbsoluteUrl, getFullPathname };
