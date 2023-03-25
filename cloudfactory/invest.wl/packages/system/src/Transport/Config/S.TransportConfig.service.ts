import { Inject, Injectable } from '@invest.wl/core';
import { ISAuthStore, SAuthStoreTid } from '../../Auth/S.Auth.types';
import { ISNetworkEndpointProvider, ISNetworkHttpClient, SNetworkEndpointProviderTid, SNetworkHttpClientTid } from '../../Network/S.Network.types';
import { ISTransportConfig, STransportConfigTid } from '../S.Transport.types';
import { IGetSystemRequest, IGetSystemResponse } from './model';

export const STransportConfigServiceTid = Symbol.for('STransportConfigServiceTid');

@Injectable()
export class STransportConfigService {
  constructor(
    @Inject(STransportConfigTid) private _tpCfg: ISTransportConfig,
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
  ) { }

  public async GetSystem(request: IGetSystemRequest): Promise<IGetSystemResponse> {
    const ep = this._epPrv.provide(this._tpCfg.configEndpointUid);
    return this._httpClient.request<IGetSystemRequest, IGetSystemResponse>(ep, request);
  }

  // public async GetUser(request: IGetUserRequest): Promise<IGetUserResponse> {
  //   const ep = this._epPrv.provide('2c548658');
  //   return this._httpClient.request<IGetUserRequest, IGetUserResponse>(ep, request, this._authStore.token);
  // }

  public async Ping(): Promise<void> {
    const ep = this._epPrv.provide('a4094601');
    return this._httpClient.request<undefined, void>(ep, undefined, this._authStore.token);
  }
}
