import { Inject, Injectable } from '@invest.wl/core';
import { ISAuthStore, SAuthStoreTid } from '../../Auth/S.Auth.types';
import { ISNetworkEndpointProvider, ISNetworkHttpClient, SNetworkEndpointProviderTid, SNetworkHttpClientTid } from '../../Network/S.Network.types';
import {
  IDeleteManyRequest,
  IDeleteManyResponse,
  IGetAlertRequest,
  IGetAlertResponse,
  IMarkViewedRequest,
  IMarkViewedResponse,
  INotificationCountRequest,
  INotificationCountResponse,
  IPostInstrumentIsFavoriteRequest,
  IPostInstrumentIsFavoriteResponse,
  ISaveAlertRequest,
  ISaveAlertResponse,
} from './model';

export const STransportDataServiceTid = Symbol.for('STransportDataServiceTid');

@Injectable()
export class STransportDataService {
  constructor(
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
  ) { }

  public async InstrumentIsFavorite(request: IPostInstrumentIsFavoriteRequest): Promise<IPostInstrumentIsFavoriteResponse> {
    const ep = this._epPrv.provide('36dd3d44');
    return this._httpClient.request<IPostInstrumentIsFavoriteRequest, IPostInstrumentIsFavoriteResponse>(ep, request, this._authStore.token);
  }

  public async AlertList(request: IGetAlertRequest): Promise<IGetAlertResponse> {
    const ep = this._epPrv.provide('3ac01a2b');
    return this._httpClient.request<IGetAlertRequest, IGetAlertResponse>(ep, request, this._authStore.token);
  }

  public async AlertSave(request: ISaveAlertRequest): Promise<ISaveAlertResponse> {
    const ep = this._epPrv.provide('35fabb0a');
    return this._httpClient.request<ISaveAlertRequest, ISaveAlertResponse>(ep, request, this._authStore.token);
  }

  public async NotificationCount(request: INotificationCountRequest): Promise<INotificationCountResponse> {
    const ep = this._epPrv.provide('d172647d');
    return this._httpClient.request<INotificationCountRequest, INotificationCountResponse>(ep, request, this._authStore.token);
  }

  public async AlertMarkViewed(request: IMarkViewedRequest): Promise<IMarkViewedResponse> {
    const ep = this._epPrv.provide('087500ad');
    return this._httpClient.request<IMarkViewedRequest, IMarkViewedResponse>(ep, request, this._authStore.token);
  }

  public async AlertDeleteMany(request: IDeleteManyRequest): Promise<IDeleteManyResponse> {
    const ep = this._epPrv.provide('a022f7f0');
    return this._httpClient.request<IDeleteManyRequest, IDeleteManyResponse>(ep, request, this._authStore.token);
  }
}
