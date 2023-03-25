import axios, { AxiosRequestConfig, AxiosPromise, Method } from 'axios';

interface APIAxiosRequestConfig extends AxiosRequestConfig {
  authRequired?: boolean;
}
const debug = true;
const API = {
  request<T = any>(method: Method, url: string, config?: APIAxiosRequestConfig): AxiosPromise<T> {
    const reqConfig = {
      method,
      url,
      ...config,
    };
    if (debug) {
      console.log(JSON.stringify(reqConfig));
    }

    const response: AxiosPromise<T> = axios(reqConfig);
    return response;
  },
  get<T = any>(url: string, data?: any, config?: APIAxiosRequestConfig): AxiosPromise<T> {
    return API.request<T>('GET', url, { params: data, ...config });
  },
  post<T = any>(url: string, data: any, config?: APIAxiosRequestConfig): AxiosPromise<T> {
    return API.request<T>('POST', url, { data, ...config });
  },
  put<T = any>(url: string, data: any, config?: APIAxiosRequestConfig): AxiosPromise<T> {
    return API.request<T>('PUT', url, { data, ...config });
  },
  delete<T = any>(url: string, data: any, config?: APIAxiosRequestConfig): AxiosPromise<T> {
    return API.request<T>('DELETE', url, { data, ...config });
  },
};

export default API;
