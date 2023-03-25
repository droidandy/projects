import { Inject, Injectable } from '@invest.wl/core';
import { ISAuthStore, SAuthStoreTid } from '../../Auth/S.Auth.types';
import { ISNetworkEndpointProvider, ISNetworkHttpClient, SNetworkEndpointProviderTid, SNetworkHttpClientTid } from '../../Network/S.Network.types';
import { IISBPLinkResponse, ISBPLinkRequest } from './model';

export const STransportTransferServiceTid = Symbol.for('STransportTransferServiceTid');

@Injectable()
export class STransportTransferService {
  constructor(
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
  ) { }

  public async Deposit(request: Omit<ISBPLinkRequest, 'accessToken'>): Promise<IISBPLinkResponse> {
    const ep = await this._epPrv.provide('SbpLink');

    return this._httpClient.request<ISBPLinkRequest, IISBPLinkResponse>(ep, {
      ...request, accessToken: this._authStore.token!,
    });
  }
}
