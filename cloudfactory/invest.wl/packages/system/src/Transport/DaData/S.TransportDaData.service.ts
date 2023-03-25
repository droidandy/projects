import { Inject, Injectable } from '@invest.wl/core';
import { ISConfigStore, SConfigStoreTid } from '../../Config/S.Config.types';
import { ISErrorService, SErrorServiceTid } from '../../Error/S.Error.types';
import { ESNetworkHttpMethod, ISNetworkHttpClient, SNetworkHttpClientTid } from '../../Network/S.Network.types';
import { IDaDataAddressRequest, IDaDataAddressResponse, IDaDataBankRequest, IDaDataBankResponse } from './model';

export const STransportDaDataServiceTid = Symbol.for('STransportDaDataServiceTid');

@Injectable()
export class STransportDaDataService {
  constructor(
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) { }

  public async Address(request: IDaDataAddressRequest): Promise<IDaDataAddressResponse> {
    if (!this._cfg.bankSearchService) {
      throw this._errorService.systemHandle('No bank search service data');
    }
    const { url, key } = this._cfg.bankSearchService;
    const headers = {
      'Authorization': 'Token ' + key,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    return this._httpClient.request<IDaDataAddressRequest, IDaDataAddressResponse>({
      method: ESNetworkHttpMethod.POST, url,
    }, request, undefined, { headers });
  }

  public async Bank(request: IDaDataBankRequest): Promise<IDaDataBankResponse> {
    if (!this._cfg.bankSearchService) {
      throw this._errorService.systemHandle('No bank search service data');
    }
    const { url, key } = this._cfg.bankSearchService;
    const headers = {
      'Authorization': 'Token ' + key,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    return this._httpClient.request<IDaDataBankRequest, IDaDataBankResponse>({
      method: ESNetworkHttpMethod.POST, url,
    }, request, undefined, { headers });
  }
}
