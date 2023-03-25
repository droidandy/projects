import axios, { AxiosRequestConfig, Canceler, AxiosPromise, Method, AxiosError } from 'axios';
import { v4 } from 'uuid';
import { getCookieAuthToken, getCookieImpersonalization } from 'helpers/authCookies';

axios.defaults.baseURL = `${process.env.BFF_URL}`;

export const MAIN_PAGE_REQUESTS_TIMEOUT = 10 * 1000;
export const REQUESTS_TIMEOUT = 30 * 1000;

const getAuthHeaders = () => ({
  ...(getCookieImpersonalization() ? { Authorization: `Bearer ${getCookieAuthToken() || ''}` } : {}),
});

export interface CancellableAxiosPromise<T = any> extends AxiosPromise<T> {
  cancel?: Canceler;
}

export type RequestConfig = Pick<AxiosRequestConfig, 'timeout'>;

interface APIAxiosRequestConfig extends AxiosRequestConfig {
  authRequired?: boolean;
  ignoreFlashMessage?: boolean;
  errorMessage?: string | ((error: AxiosError) => string | undefined);
}

const API = {
  request<T = any>(method: Method, url: string, config?: APIAxiosRequestConfig): CancellableAxiosPromise<T> {
    // add auth header
    if (config?.authRequired !== undefined) {
      // eslint-disable-next-line no-param-reassign
      config = {
        ...config,
        headers: { ...config.headers, ...getAuthHeaders() },
        withCredentials: true,
      };
    }

    // make it cancellable
    const source = axios.CancelToken.source();

    const response: CancellableAxiosPromise = axios({
      method,
      url,
      headers: {
        'X-Request-Id': v4(),
      },
      cancelToken: source.token,
      timeout: config?.timeout || REQUESTS_TIMEOUT,
      ...config,
    });

    response.cancel = source.cancel;

    return response;
  },
  get<T = any>(url: string, data?: any, config?: APIAxiosRequestConfig): CancellableAxiosPromise<T> {
    return API.request<T>('GET', url, { params: data, ...config });
  },
  post<T = any>(url: string, data: any, config?: APIAxiosRequestConfig): CancellableAxiosPromise<T> {
    return API.request<T>('POST', url, { data, ...config });
  },
  put<T = any>(url: string, data: any, config?: APIAxiosRequestConfig): CancellableAxiosPromise<T> {
    return API.request<T>('PUT', url, { data, ...config });
  },
  delete<T = any>(url: string, data: any, config?: APIAxiosRequestConfig): CancellableAxiosPromise<T> {
    return API.request<T>('DELETE', url, { data, ...config });
  },
};

export default API;
