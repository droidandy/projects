import { parse as parseUrl, format as formatUrl } from 'url';
import AuthService from 'services/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

class ApiBase {
  constructor() {
    this.logger = (...args) => console.log(`API `, ...args);
  }

  async get(pathname = '', query = {}, options = {}) {
    return this.api({ pathname, query }, options);
  }

  async post(pathname, data = {}, query = {}, options = {}) {
    return this.api(
      { pathname, query },
      {
        ...options,
        method: 'post',
        body: data,
      }
    );
  }

  async put(pathname, data = {}, query = {}, options = {}) {
    return this.api(
      { pathname, query },
      {
        ...options,
        method: 'put',
        body: data,
      }
    );
  }

  async delete(pathname, query = {}, options = {}) {
    return this.api(
      { pathname, query },
      {
        ...options,
        method: 'delete',
      }
    );
  }

  async api(url, options = {}) {
    let { body, headers = {} } = options;
    const token = AuthService.getToken();
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    if (body && typeof body === 'object') {
      if (headers['Content-Type'] === 'application/json') {
        body = this.handleBodyAsJson(body);
      } else if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        body = this.handleBodyAsFormUrlencoded(body);
      }
    }
    let opts = { ...options, body, headers };
    const apiUrl = this.apiUrl(url);
    this.logger('request', apiUrl, opts);
    const res = await fetch(apiUrl, opts);
    return this.handleResponse(res);
  }

  apiUrl(url = {}) {
    const { pathname, query = {}, ...other } = url;
    const parsedApiUrl = parseUrl(API_URL);
    return formatUrl({
      ...parsedApiUrl,
      pathname: `${parsedApiUrl.pathname}/${pathname}`,
      query,
      ...other,
    });
  }

  async handleResponse(res) {
    const contentType = res.headers.get('content-type') || 'text';
    if (contentType.includes('json')) {
      return this.handleResponseAsJson(res);
    }
    return this.handleResponseAsText(res);
  }

  handleBodyAsJson(data = {}) {
    return JSON.stringify(data);
  }

  handleBodyAsFormUrlencoded(body) {
    return Object.entries(body)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) =>
        Array.isArray(value) ? value.map(item => `${key}=${item}`).join('&') : `${key}=${value}`
      )
      .join('&');
  }

  async handleResponseAsJson(res) {
    if (res.status >= 400) {
      const error = await res.json();
      this.logger('error', error);
      throw error;
    }
    if (res.status === 204) {
      return null;
    }
    let data = await res.json();
    data = typeof data === 'string' ? JSON.parse(data) : data;
    this.logger('response', res.url, res.status, res.headers.get('content-type'), data);
    return data;
  }

  async handleResponseAsText(res) {
    if (res.status >= 400) {
      const error = await res.text();
      this.logger('error', error);
      throw error;
    }
    if (res.status === 204) {
      return null;
    }
    const data = await res.text();
    this.logger('response', res.url, res.status, res.headers.get('content-type'), data);
    return data;
  }
}

export default ApiBase;
