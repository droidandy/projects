import { Inject, Injectable } from '@invest.wl/core';
import { ISAuthStore, SAuthStoreTid } from '../../Auth/S.Auth.types';
import { ISNetworkEndpointProvider, ISNetworkHttpClient, SNetworkEndpointProviderTid, SNetworkHttpClientTid } from '../../Network/S.Network.types';
import { IPortfelSummaryRequest, IPortfelSummaryResponse } from './model';
import { IGetPortfelPLByInstrumentRequest, IGetPortfelPLByInstrumentResponse } from './model/IPortfelPLByInstrument';
import { IGetTradingDataAccountListRequest, IGetTradingDataAccountListResponse } from './model/IQuikAccountList';
import { memoizeAsync } from '@invest.wl/common';

export const STransportQUIKServiceTid = Symbol.for('STransportQUIKServiceTid');

@Injectable()
export class STransportQUIKService {
  constructor(
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
  ) {
  }

  public async PortfelSummary(req: IPortfelSummaryRequest): Promise<IPortfelSummaryResponse> {
    const ep = await this._epPrv.provide('9eaeed4e');
    return this._httpClient.request<IPortfelSummaryRequest, IPortfelSummaryResponse>(ep, req, this._authStore.token);
  }

  public async PortfelPLByInstrument(req: IGetPortfelPLByInstrumentRequest): Promise<IGetPortfelPLByInstrumentResponse> {
    const ep = await this._epPrv.provide('b8ee96ce');
    return this._httpClient.request<any, any>(ep, req, this._authStore.token);
  }

  @memoizeAsync(2000)
  public async AccountList(req: IGetTradingDataAccountListRequest): Promise<IGetTradingDataAccountListResponse> {
    const ep = await this._epPrv.provide('46a83da8');
    return this._httpClient.request<any, any>(ep, req, this._authStore.token);
  }
}
