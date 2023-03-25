import { Inject, Injectable, TObject } from '@invest.wl/core';
import { ISAuthStore, SAuthStoreTid } from '../../Auth/S.Auth.types';
import { ISErrorService, SErrorServiceTid } from '../../Error/S.Error.types';
import { ISNetworkEndpointProvider, ISNetworkHttpClient, SNetworkEndpointProviderTid, SNetworkHttpClientTid } from '../../Network/S.Network.types';
import {
  IDocumentConfirmRequest,
  IDocumentConfirmResponse,
  IDocumentCreateRequest,
  IDocumentCreateResponse,
  IDocumentPrepareRequest,
  IDocumentPrepareResponse,
  IDocumentResendRequest,
  IDocumentResendResponse,
} from './model';
import { IDocumentListRequest, IDocumentListResponse } from './model/IDocumentList';

export const STransportDocumentServiceTid = Symbol.for('STransportDocumentServiceTid');

type TNoSession<T extends TObject> = Omit<T, 'tx_id'>;

@Injectable()
export class STransportDocumentService {
  private txId?: string;

  constructor(
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) { }

  public async Create(request: TNoSession<IDocumentCreateRequest>): Promise<IDocumentCreateResponse> {
    const ep = await this._epPrv.provide('0acf7b61');

    return this._httpClient.request<IDocumentCreateRequest, IDocumentCreateResponse>(ep, request, this._authStore.token);
  }

  public async Prepare(request: TNoSession<IDocumentPrepareRequest>): Promise<IDocumentPrepareResponse> {
    const ep = await this._epPrv.provide('345f8c4b');

    return this._httpClient.request<IDocumentPrepareRequest, IDocumentPrepareResponse>(ep, request, this._authStore.token)
      .then(res => {
        this.txId = res.tx_id;
        return res;
      });
  }

  public async Confirm(request: TNoSession<IDocumentConfirmRequest>): Promise<IDocumentConfirmResponse> {
    const ep = await this._epPrv.provide('5930a257');
    if (!this.txId) throw this._errorService.systemHandle('no session data');
    return this._httpClient.request<IDocumentConfirmRequest, IDocumentConfirmResponse>(ep, {
      ...request, tx_id: this.txId,
    }, this._authStore.token);
  }

  public async Resend(request: TNoSession<IDocumentResendRequest>): Promise<IDocumentResendResponse> {
    const ep = await this._epPrv.provide('5ae608cc');
    if (!this.txId) throw this._errorService.systemHandle('no session data');
    return this._httpClient.request<IDocumentResendRequest, IDocumentResendResponse>(ep, {
      tx_id: this.txId,
    }, this._authStore.token);
  }

  public async ListSelf(request: TNoSession<IDocumentListRequest>): Promise<IDocumentListResponse> {
    const ep = await this._epPrv.provide('27d53f84.1b4356fa');

    return this._httpClient.request<IDocumentListRequest, IDocumentListResponse>(ep, request, this._authStore.token);
  }
}
