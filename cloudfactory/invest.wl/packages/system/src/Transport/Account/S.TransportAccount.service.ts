import { Inject, Injectable } from '@invest.wl/core';
import { ISAuthStore, SAuthStoreTid } from '../../Auth/S.Auth.types';
import { ISNetworkEndpointProvider, ISNetworkHttpClient, SNetworkEndpointProviderTid, SNetworkHttpClientTid } from '../../Network/S.Network.types';
import { IAccountPreferenceRequest, IAccountPreferenceResponse, IAccountSettingsResponse } from './model';

export const STransportAccountServiceTid = Symbol.for('STransportAccountServiceTid');

@Injectable()
export class STransportAccountService {
  constructor(
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
  ) {
  }

  public async Settings(): Promise<IAccountSettingsResponse> {
    const ep = this._epPrv.provide('abaeb5b8');
    return this._httpClient.request<undefined, IAccountSettingsResponse>(ep, undefined, this._authStore.token);
  }

  public async Preference(req: IAccountPreferenceRequest): Promise<IAccountPreferenceResponse> {
    const ep = this._epPrv.provide('ae6e52d1');
    return this._httpClient.request<IAccountPreferenceRequest, IAccountSettingsResponse>(ep, req, this._authStore.token);
  }
}
