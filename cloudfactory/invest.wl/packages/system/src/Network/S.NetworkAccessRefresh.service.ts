import { Inject, Injectable, IPromiseCb } from '@invest.wl/core';
import { AxiosRequestConfig } from 'axios';
import { makeObservable, observable, runInAction } from 'mobx';
import { ISAuthStore, SAuthStoreTid } from '../Auth/S.Auth.types';
import { SErrorHttpModel } from '../Error/model/S.ErrorHttp.model';
import { ISNetworkEndpointProvider, SNetworkEndpointProviderTid } from './S.Network.types';

interface IInterceptRequestResult { config: AxiosRequestConfig; token?: string };

@Injectable()
export class SNetworkAccessRefreshService {
  // TODO: что если никто не подсосётся к этому резолверу? тогда вся очередь запросов никогда не разрешится?
  @observable public resolver?: IPromiseCb<string>;

  private _awaiter?: Promise<string>;
  private _requestUnauthorized: ((token?: string) => Promise<void>)[] = [];

  constructor(
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
  ) {
    makeObservable(this);
  }

  public interceptRequest = async (config: AxiosRequestConfig) => {
    let isTokenRefreshRequest = false;
    try {
      isTokenRefreshRequest = this._epPrv.isConfigured && !!config.url?.includes(this._epPrv.provide('refresh').url);
    } catch (e: any) {
      // на момент запроса refresh эндпоинта, может быть ещё не заполнен endpointProvider
    }
    if (!isTokenRefreshRequest) {
      if (this._awaiter) {
        return new Promise<IInterceptRequestResult>((resolve) => {
          if (this._awaiter) this._awaiter.then((token) => resolve({ config, token }));
          else resolve({ config });
        });
      } else if (this._authStore.refreshNeed) {
        return new Promise<IInterceptRequestResult>((resolve, reject) => {
          this.repeatAfterRefresh(async (token?: string) => {
            token ? resolve({ config, token }) : reject(new SErrorHttpModel({
              status: 60003, httpStatus: 60003, name: 'HttpError', body: {},
              message: 'Не удалось обновить сессию', url: this._epPrv.provide('refresh').url,
            }));
          });
        });
      }
    }
    return Promise.resolve<IInterceptRequestResult>({ config });
  };

  public repeatAfterRefresh = (repeatRequest: (token?: string) => Promise<void>) => {
    this._requestUnauthorized.push(repeatRequest);
    this._awaiterEnable();
  };

  private _awaiterEnable() {
    if (!this._awaiter) {
      this._awaiter = new Promise<string>((resolve, reject) => {
        runInAction(() => (this.resolver = { resolve, reject }));
      }).then((token) => {
        for (const request of this._requestUnauthorized) {
          request(token).then();
        }
        this._awaiterDisable();
        return token;
      }).catch((err: any) => {
        for (const request of this._requestUnauthorized) {
          request().then();
        }
        this._awaiterDisable();
        throw err;
      });
    }
  }

  private _awaiterDisable() {
    runInAction(() => (this.resolver = undefined));
    this._awaiter = undefined;
    this._requestUnauthorized = [];
  }
}
