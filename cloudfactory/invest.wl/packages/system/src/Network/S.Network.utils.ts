import mapValues from 'lodash/mapValues';
import transform from 'lodash/transform';
import urljoin from 'url-join';

export function req2url(url: string, req: any): string {
  if (req) {
    const params = req2params(JSONifyReq(req));
    if (params) {
      return urljoin(url, '?' + params);
    }

    return url;
  }

  return url;
}

export function JSONifyReq(req: any) {
  return mapValues(req, (val: any) => val && val.toJSON ? val.toJSON() : val);
}

export function req2params(req: any) {
  return transform(req, (res: string[], val: any, key: any) => {
    if (val != null) {
      res.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    }
  }, []).join('&');
}

export function toAbsUrl(url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return urljoin(baseUrl, url);
}

/** Returns {@code s} with control characters and non-ASCII characters replaced with '?'. */
export function toHumanReadableAscii(s: string): string {
  let result = '';
  for (const i of s) {
    if (i > '\u001f' && i < '\u007f') {
      result += i;
    } else {
      result += '?';
    }
  }

  return result;
}
