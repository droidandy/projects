import { EDAuthStrategy, Inject, Injectable } from '@invest.wl/core';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import merge from 'lodash/merge';
import { ISAuthConfig, SAuthConfigTid } from '../../Auth/S.Auth.types';
import { ISDeviceStore, SDeviceStoreTid } from '../../Device/S.Device.types';
import { SErrorHttpModel } from '../../Error/model/S.ErrorHttp.model';
import { ISErrorHttpModel, ISErrorService, SErrorServiceTid } from '../../Error/S.Error.types';
import {
  ESNetworkStatus,
  ESNetworkTokenMode,
  ISNetworkConfig,
  ISNetworkHttpSender,
  ISNetworkStore,
  SNetworkAccessRefreshServiceTid,
  SNetworkConfigTid,
  SNetworkStoreTid,
} from '../S.Network.types';
import { req2url, toHumanReadableAscii } from '../S.Network.utils';
import { SNetworkAccessRefreshService } from '../S.NetworkAccessRefresh.service';

@Injectable()
export class SNetworkHttpAxiosSender implements ISNetworkHttpSender {
  private _sender = axios.create();

  private get _refreshCan() {
    return this._authCfg.strategy === EDAuthStrategy.RefreshToken;
  }

  private _tokenMode?: ESNetworkTokenMode = undefined;
  public get tokenMode() {
    return this._tokenMode ?? this._cfg.tokenMode;
  }

  public set tokenMode(v) {
    this._tokenMode = v;
  }

  constructor(
    @Inject(SNetworkConfigTid) private _cfg: ISNetworkConfig,
    @Inject(SNetworkStoreTid) private _nwStore: ISNetworkStore,
    @Inject(SNetworkAccessRefreshServiceTid) private _accessRefresh: SNetworkAccessRefreshService,
    @Inject(SDeviceStoreTid) private _device: ISDeviceStore,
    @Inject(SAuthConfigTid) private _authCfg: ISAuthConfig,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) {
    this._sender.interceptors.request.use(r =>
      this._refreshCan ? this._accessRefresh.interceptRequest(r).then(res => this._tokenAdd2Req(res.config, res.token)) : r);
    this._sender.interceptors.response.use(
      (r) => r,
      (err: AxiosError<any>) => new Promise((resolve, reject) => {
        const error = err instanceof SErrorHttpModel ? err
          : this._errorCreate(axios.isAxiosError(err) ? err.response : { data: { message: err.message } } as any);
        // если получили ошибку доступа, пробуем обновить токены
        if (this._refreshCan && error.isUnauthorized) {
          this._accessRefresh.repeatAfterRefresh(async (token?: string) => {
            if (!token) reject(error);
            else await this._sender.request(this._tokenAdd2Req(err.config, token)).then(resolve).catch(reject);
          });
        } else {reject(error);}
      }),
    );
  }

  public async fetch(url: string, opts: AxiosRequestConfig, token?: string, cancelSource?: CancelTokenSource) {
    const deviceInfo = await this._device.getDeviceInfoAsString();
    opts.headers = merge(opts.headers || {}, {
      'X-Requested-With': toHumanReadableAscii(deviceInfo || ''),
    });

    const config: AxiosRequestConfig = { ...opts, url, cancelToken: cancelSource?.token };
    if (token) this._tokenAdd2Req(config, token);
    return this._sender.request(config).then(this._responseHandle).catch(this._errorHandle);
  }

  public abort(cancelSource: CancelTokenSource) {
    cancelSource.cancel();
  }

  private _responseHandle = (response: AxiosResponse<any>) => {
    const isError = !!response.data?.status ? !this._cfg.responseOk.includes(response.data.status) : false;
    if (isError) throw response;

    this._nwStore.stateSet({ httpStatus: response.status, apiStatus: ESNetworkStatus.OK });
    return response;
  };

  private _errorHandle = (response: AxiosResponse<any> | ISErrorHttpModel<any>) => {
    const error = (response as ISErrorHttpModel).toError ? response as ISErrorHttpModel : this._errorCreate(response as AxiosResponse<any>);
    this._errorService.httpHandle(error);
    this._nwStore.stateSet({
      httpStatus: error.dto.httpStatus,
      apiStatus: ESNetworkStatus.ERROR,
      apiError: error,
    });
    throw error;
  };

  private _errorCreate = (res: AxiosResponse<any> | undefined) => {
    const body = res?.data;
    return new SErrorHttpModel({
      status: body?.status ?? body?.Status ?? body?.Code ?? body?.error ?? res?.status,
      httpStatus: res?.status || -1, name: 'HttpError', body, url: res?.config.url || '',
      message: body?.message ?? body?.Message ?? body?.error_description,
    });
  };

  private _tokenAdd2Req(req: AxiosRequestConfig, token?: string) {
    if (token) {
      if (this.tokenMode === ESNetworkTokenMode.Header) {
        if (!req.headers) req.headers = {};
        req.headers.Authorization = `${this._cfg.tokenPrefix || 'Bearer'} ${token}`;
      } else if (req.url) {
        req.url = req2url(req.url, { token });
      }
    }
    return req;
  }
}
