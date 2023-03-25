import { Inject, Injectable } from '@invest.wl/core';
import { ISAuthStore, SAuthStoreTid } from '../../Auth/S.Auth.types';
import { ISNetworkEndpointProvider, ISNetworkHttpClient, SNetworkEndpointProviderTid, SNetworkHttpClientTid } from '../../Network/S.Network.types';
import { IMarketHistoryRequest, IMarketHistoryResponse } from './model';

export const STransportMarketServiceTid = Symbol.for('STransportMarketServiceTid');

@Injectable()
export class STransportMarketService {
  constructor(
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
  ) {
  }

  public async History(request: IMarketHistoryRequest): Promise<IMarketHistoryResponse> {
    const ep = this._epPrv.provide('b2226b71');

    return this._httpClient.request<IMarketHistoryRequest, IMarketHistoryResponse>(ep, request, this._authStore.token);
  }
}
