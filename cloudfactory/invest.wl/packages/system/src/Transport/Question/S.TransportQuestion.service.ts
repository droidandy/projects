import { Inject, Injectable } from '@invest.wl/core';
import { SAuthStore, SAuthStoreTid } from '../../Auth';
import { ISNetworkEndpointProvider, ISNetworkHttpClient, SNetworkEndpointProviderTid, SNetworkHttpClientTid } from '../../Network';
import { IQuestionListRequest, IQuestionListResponse, IQuestionSaveRequest, IQuestionSaveResponse, ISectionListRequest, ISectionListResponse } from './model';

export const STransportQuestionServiceTid = Symbol.for('STransportQuestionServiceTid');

@Injectable()
export class STransportQuestionService {
  constructor(
    @Inject(SNetworkHttpClientTid) private _httpClient: ISNetworkHttpClient,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SAuthStoreTid) private _authStore: SAuthStore,
  ) { }

  public async List(request: IQuestionListRequest): Promise<IQuestionListResponse> {
    const ep = await this._epPrv.provide('27d53f84.9739832d');

    return this._httpClient.request<IQuestionListRequest, IQuestionListResponse>(ep, request, this._authStore.token);
  }

  public async Save(request: IQuestionSaveRequest): Promise<IQuestionSaveResponse> {
    const ep = await this._epPrv.provide('111bf306');
    request = { questions: request.questions.map(q => ({ ...q, value: q.value.toString() })) };
    return this._httpClient.request<IQuestionSaveRequest, IQuestionSaveResponse>(ep, request, this._authStore.token);
  }

  public async SectionList(request: ISectionListRequest): Promise<ISectionListResponse> {
    const ep = await this._epPrv.provide('27d53f84.d5ebab0a');

    return this._httpClient.request<ISectionListRequest, ISectionListResponse>(ep, request, this._authStore.token)
      .then(res => ({ ...res, section: res.section.map(i => ({ ...i, id: i.code })) }));
  }
}
