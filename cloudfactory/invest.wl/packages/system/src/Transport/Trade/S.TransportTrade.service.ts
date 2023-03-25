import { Inject, Injectable } from '@invest.wl/core';
import { ISAuthStore, SAuthStoreTid } from '../../Auth/S.Auth.types';
import { ISNetworkEndpointProvider, ISNetworkHttpClient, SNetworkEndpointProviderTid, SNetworkHttpClientTid } from '../../Network/S.Network.types';
import {
  IDataAccountListRequest,
  IDataAccountListResponse,
  IDataInstrumentRequest,
  IDataInstrumentResponse,
  IDataOrderRequest,
  IDataOrderResponse,
  IPostDoCancelOrderRequest,
  IPostDoCancelOrderResponse,
  IPostDoConfirmOrderRequestRequest,
  IPostDoConfirmOrderRequestResponse,
  IPostDoSendNewConfirmOrderRequestCodeRequest,
  IPostDoSendNewConfirmOrderRequestCodeResponse,
  IPostOrderGetNewIdRequest,
  IPostOrderGetNewIdResponse,
  IPostOrderSaveRequestRequest,
  IPostOrderSaveRequestResponse,
} from './model';

export const STransportTradeServiceTid = Symbol.for('STransportTradeServiceTid');

@Injectable()
export class STransportTradeService {
  constructor(
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
  ) {
  }

  public async DataAccountList(req: IDataAccountListRequest): Promise<IDataAccountListResponse> {
    const ep = await this._epPrv.provide('b6857987');
    return this._httpClient.request<IDataAccountListRequest, IDataAccountListResponse>(ep, req, this._authStore.token);
  }

  public async DataInstrument(req: IDataInstrumentRequest): Promise<IDataInstrumentResponse> {
    const ep = await this._epPrv.provide('67a58c3d');
    return this._httpClient.request<IDataInstrumentRequest, IDataInstrumentResponse>(ep, req, this._authStore.token);
  }

  public async DataOrder(req: IDataOrderRequest): Promise<IDataOrderResponse> {
    const ep = await this._epPrv.provide('68ea43ee');
    return this._httpClient.request<IDataOrderRequest, IDataOrderResponse>(ep, req, this._authStore.token);
  }

  public async DoCancelOrder(req: IPostDoCancelOrderRequest): Promise<IPostDoCancelOrderResponse> {
    const ep = await this._epPrv.provide('0a33eefb');
    return this._httpClient.request<IPostDoCancelOrderRequest, IPostDoCancelOrderResponse>(ep, req, this._authStore.token);
  }

  public async DoConfirmOrderRequest(req: IPostDoConfirmOrderRequestRequest): Promise<IPostDoConfirmOrderRequestResponse> {
    const ep = await this._epPrv.provide('092bef7b');
    return this._httpClient.request<IPostDoConfirmOrderRequestRequest, IPostDoConfirmOrderRequestResponse>(ep, req, this._authStore.token);
  }

  public async DoSendNewConfirmOrderRequestCode(req: IPostDoSendNewConfirmOrderRequestCodeRequest): Promise<IPostDoSendNewConfirmOrderRequestCodeResponse> {
    // TODO: check EP
    const ep = await this._epPrv.provide('212240db');
    return this._httpClient.request<IPostDoSendNewConfirmOrderRequestCodeRequest, IPostDoSendNewConfirmOrderRequestCodeResponse>(ep, req, this._authStore.token);
  }

  public async OrderGetNewId(req: IPostOrderGetNewIdRequest): Promise<IPostOrderGetNewIdResponse> {
    const ep = await this._epPrv.provide('578a9e38');
    return this._httpClient.request<IPostOrderGetNewIdRequest, IPostOrderGetNewIdResponse>(ep, req, this._authStore.token);
  }

  public async OrderSaveRequest(req: IPostOrderSaveRequestRequest): Promise<IPostOrderSaveRequestResponse> {
    const ep = await this._epPrv.provide('bf475bf6');
    return this._httpClient.request<IPostOrderSaveRequestRequest, IPostOrderSaveRequestResponse>(ep, req, this._authStore.token);
  }
}
