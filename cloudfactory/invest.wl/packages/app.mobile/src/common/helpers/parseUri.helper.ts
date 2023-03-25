interface IParseUriResponse {
  url: string;
  params: { [key: string]: string };
}

export function parseUri(uri: string): IParseUriResponse {
  const [url, paramsStr] = uri.split('?');
  const params: any = {};
  if (paramsStr) {
    paramsStr.split('&').forEach(paramStr => {
      const [key, value] = paramStr.split('=');
      params[key] = value;
    });
  }
  return { url, params };
}
