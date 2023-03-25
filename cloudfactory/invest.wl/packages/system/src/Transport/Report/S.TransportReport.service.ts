import { Inject, Injectable } from '@invest.wl/core';
import { ISAuthStore, SAuthStoreTid } from '../../Auth/S.Auth.types';
import {
  ISNetworkEndpointProvider, ISNetworkHttpClient, SNetworkEndpointProviderTid, SNetworkHttpClientTid,
} from '../../Network/S.Network.types';
import {
  IGetCouponListRequest,
  IGetCouponListResponse,
  IGetInstrumentSummaryRequest,
  IGetInstrumentSummaryResponse,
  IGetInvestIdeaListRequest,
  IGetInvestIdeaListResponse,
  IGetNewsListRequest,
  IGetNewsListResponse,
  IGetNonTradeOperationRequest,
  IGetNonTradeOperationResponse,
  IGetPortfelChartRequest,
  IGetPortfelChartResponse,
  IGetPortfelMVChartRequest,
  IGetPortfelMVChartResponse,
  IGetPortfelPLByInstrumentRequest,
  IGetPortfelPLByInstrumentResponse,
  IGetPortfelTableOrderRequest,
  IGetPortfelTableOrderResponse,
  IGetPortfelTableTradeRequest,
  IGetPortfelTableTradeResponse,
  IGetStoryListRequest,
  IGetStoryListResponse,
  IInstrumentQuoteFeedRequest,
  IInstrumentQuoteFeedResponse,
  IInstrumentSearchRequest,
  IInstrumentSearchResponse,
} from './model';
import { memoizeAsync } from '@invest.wl/common';

export const STransportReportServiceTid = Symbol.for('STransportReportServiceTid');

@Injectable()
export class STransportReportService {
  constructor(
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
  ) {
  }

  public async InstrumentQuoteFeed(request: IInstrumentQuoteFeedRequest): Promise<IInstrumentQuoteFeedResponse> {
    const ep = await this._epPrv.provide('17a72174');
    return this._httpClient.request<IInstrumentQuoteFeedRequest, IInstrumentQuoteFeedResponse>(ep, request, this._authStore.token);
  }

  public async InstrumentSearch(request: IInstrumentSearchRequest): Promise<IInstrumentSearchResponse> {
    const ep = await this._epPrv.provide('f9fdfd89');
    return this._httpClient.request<IInstrumentSearchRequest, IInstrumentSearchResponse>(ep, request, this._authStore.token);
  }

  @memoizeAsync(2000)
  public async InstrumentSummary(request: IGetInstrumentSummaryRequest): Promise<IGetInstrumentSummaryResponse> {
    const ep = await this._epPrv.provide('5330116e');
    return this._httpClient.request<IGetInstrumentSummaryRequest, IGetInstrumentSummaryResponse>(ep, request, this._authStore.token)
      .then(res => Array.isArray(res) ? res[0] : res);
  }

  public async InstrumentSummaryList(request: IGetInstrumentSummaryRequest): Promise<IGetInstrumentSummaryResponse[]> {
    const ep = await this._epPrv.provide('e5f91c5c');
    return this._httpClient.request<IGetInstrumentSummaryRequest, IGetInstrumentSummaryResponse[]>(ep, request, this._authStore.token);
  }

  public async PortfelPLByInstrument(request: IGetPortfelPLByInstrumentRequest): Promise<IGetPortfelPLByInstrumentResponse> {
    const ep = await this._epPrv.provide('9f315412');
    return this._httpClient.request<IGetPortfelPLByInstrumentRequest, IGetPortfelPLByInstrumentResponse>(ep, request, this._authStore.token);
  }

  public async InvestIdeaList(request: IGetInvestIdeaListRequest): Promise<IGetInvestIdeaListResponse> {
    const ep = await this._epPrv.provide('363b2da3');
    return this._httpClient.request<IGetInvestIdeaListRequest, IGetInvestIdeaListResponse>(ep, request, this._authStore.token);
  }

  public async CouponList(request: IGetCouponListRequest): Promise<IGetCouponListResponse> {
    const ep = await this._epPrv.provide('a87bae8a');
    return this._httpClient.request<IGetCouponListRequest, IGetCouponListResponse>(ep, request, this._authStore.token);
  }

  public async PortfelTableOrder(request: IGetPortfelTableOrderRequest): Promise<IGetPortfelTableOrderResponse> {
    const ep = await this._epPrv.provide('d499cbb3');
    return this._httpClient.request<IGetPortfelTableOrderRequest, IGetPortfelTableOrderResponse>(ep, request, this._authStore.token);
  }

  public async PortfelTableTrade(request: IGetPortfelTableTradeRequest): Promise<IGetPortfelTableTradeResponse> {
    const ep = await this._epPrv.provide('ff7ecd46');
    return this._httpClient.request<IGetPortfelTableTradeRequest, IGetPortfelTableTradeResponse>(ep, request, this._authStore.token);
  }

  public async NonTradeOperation(request: IGetNonTradeOperationRequest): Promise<IGetNonTradeOperationResponse> {
    const ep = await this._epPrv.provide('3ff4cc1b');
    return this._httpClient.request<IGetNonTradeOperationRequest, IGetNonTradeOperationResponse>(ep, request, this._authStore.token);
  }

  public async PortfelChart(request: IGetPortfelChartRequest): Promise<IGetPortfelChartResponse> {
    // TODO: check EP
    const ep = await this._epPrv.provide('3bb7a1c6');
    return this._httpClient.request<IGetPortfelChartRequest, IGetPortfelChartResponse>(ep, request, this._authStore.token);
  }

  public async PortfelMVChart(request: IGetPortfelMVChartRequest): Promise<IGetPortfelMVChartResponse> {
    const ep = await this._epPrv.provide('f4702cb3');
    return this._httpClient.request<IGetPortfelMVChartRequest, IGetPortfelMVChartResponse>(ep, request, this._authStore.token);
  }

  public async StoryList(request: IGetStoryListRequest): Promise<IGetStoryListResponse> {
    const ep = await this._epPrv.provide('4efbb77b');
    return this._httpClient.request<IGetStoryListRequest, IGetStoryListResponse>(ep, request, this._authStore.token);
  }

  public async NewsList(request: IGetNewsListRequest): Promise<IGetNewsListResponse> {
    const ep = await this._epPrv.provide('9b1c52d9');
    return this._httpClient.request<IGetNewsListRequest, IGetNewsListResponse>(ep, request, this._authStore.token);
  }
}
