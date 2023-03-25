import { Inject, Injectable } from '@invest.wl/core';
import { ISAuthStore, SAuthStoreTid } from '../../Auth/S.Auth.types';
import { ISNetworkEndpointProvider, ISNetworkHttpClient, SNetworkEndpointProviderTid, SNetworkHttpClientTid } from '../../Network/S.Network.types';
import { ISPnUnlinkDeviceRequest, ISPnUnlinkDeviceResponse } from './model';
import { ISPnLinkDeviceRequest, ISPnLinkDeviceResponse } from './model/ISPnLinkDevice';

export const STransportPushNotificationServiceTid = Symbol.for('STransportPushNotificationServiceTid');

@Injectable()
export class STransportPushNotificationService {
  constructor(
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
  ) { }

  public async Link(request: ISPnLinkDeviceRequest): Promise<ISPnLinkDeviceResponse> {
    const ep = this._epPrv.provide('1bc47780');
    return this._httpClient.request<ISPnLinkDeviceRequest, ISPnLinkDeviceResponse>(ep, request, this._authStore.token);
  }

  public async Unlink(request: ISPnUnlinkDeviceRequest): Promise<ISPnUnlinkDeviceResponse> {
    const ep = this._epPrv.provide('7cc10ec8');
    return this._httpClient.request<ISPnUnlinkDeviceRequest, ISPnUnlinkDeviceResponse>(ep, request, this._authStore.token);
  }
}
