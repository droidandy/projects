import { Inject, Injectable } from '@invest.wl/core';
import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import merge from 'lodash/merge';
import {
  ESNetworkHttpMethod,
  ESNetworkTokenMode,
  ICancellablePromise,
  ISNetworkHttpClient,
  ISNetworkHttpEndpoint,
  ISNetworkHttpSender,
  SNetworkHttpSenderTid,
} from '../S.Network.types';
import { JSONifyReq, req2params, req2url } from '../S.Network.utils';

const optionsDefault: AxiosRequestConfig = {};

@Injectable()
export class SNetworkHttpClient implements ISNetworkHttpClient {
  private static async _handleResponse(response: AxiosResponse<any>) {
    if (response) {
      const json = await response.data;
      return json?.data ? { status: json.status, ...json.data } : json;
    }

    throw new Error('SNetworkHttpClient._handleResponse. Never reachable development code');
  }

  private static _isContentTypeEquals(headers: HeadersInit | undefined, contentType: string) {
    let result = false;
    if (headers) {
      const myHeaders = new Headers(headers);
      const value = myHeaders.get('Content-Type');
      result = (value || '').toLocaleLowerCase() === contentType.toLocaleLowerCase();
    }
    return result;
  }

  private static _reqToFormData<T>(req: T): FormData {
    const formData = new FormData();
    Object.keys(req).forEach(key => {
      formData.append(key, (req as any)[key]);
    });
    return formData;
  }

  public get tokenMode() {
    return this._http.tokenMode;
  }
  public set tokenMode(v: ESNetworkTokenMode | undefined) {
    this._http.tokenMode = v;
  }

  constructor(
    @Inject(SNetworkHttpSenderTid) private _http: ISNetworkHttpSender,
  ) { }

  public request<Req, Resp>(endPoint: ISNetworkHttpEndpoint, req: Req, token?: string, options?: AxiosRequestConfig): ICancellablePromise<Resp> {
    return this._request(endPoint.method, endPoint.url, req, token, options) as ICancellablePromise<Resp>;
  }

  private async _request<Req, Resp>(method: ESNetworkHttpMethod, url: string, req: Req, token?: string, options?: AxiosRequestConfig): Promise<Resp> {
    options = { ...optionsDefault, ...options };
    const cancelSource = axios.CancelToken.source();
    let data: string | FormData | undefined;
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    if (method !== ESNetworkHttpMethod.GET) {
      if (req) {
        const isFormUrlEncoded = SNetworkHttpClient._isContentTypeEquals(options.headers, 'application/x-www-form-urlencoded');
        const isFormData = SNetworkHttpClient._isContentTypeEquals(options.headers, 'multipart/form-data');
        const isBinaryData = SNetworkHttpClient._isContentTypeEquals(options.headers, 'application/json');
        if (isFormData) {
          data = SNetworkHttpClient._reqToFormData(req);
        } else if (isFormUrlEncoded) {
          data = req2params(JSONifyReq(req));
        } else if (isBinaryData) {
          headers['Content-Type'] = 'application/json';
          data = JSON.stringify(req);
        } else {
          headers['Content-Type'] = 'application/json';
          data = JSON.stringify(JSONifyReq(req));
        }
      }
    } else {
      url = req2url(url, req);
    }

    let opts: AxiosRequestConfig = { method, data, headers };
    if (options) opts = merge(opts, options);

    return this._fetchCancellable<Resp>(url, opts, token, cancelSource).then(SNetworkHttpClient._handleResponse);
  }

  private _fetchCancellable<Resp>(url: string, opts: AxiosRequestConfig, token?: string, cancelSource?: CancelTokenSource) {
    const rv = this._http.fetch(url, opts, token, cancelSource) as unknown as ICancellablePromise<AxiosResponse<Resp>>;
    rv.cancel = () => this._http.abort(cancelSource);
    return rv;
  }
}
