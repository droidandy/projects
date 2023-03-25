import { DSortX, EDSortXType, ILambda, lambdaResolve } from '@invest.wl/common';

import { EDInstrumentQuoteType, IDInstrumentQuoteListRequestDTO, IDInstrumentQuoteListSort, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DInstrumentConfig, DInstrumentConfigTid } from '../D.Instrument.config';
import { DInstrumentGateway, DInstrumentGatewayTid } from '../D.Instrument.gateway';

export const DInstrumentQuoteListCaseTid = Symbol.for('DInstrumentQuoteListCaseTid');
type TListReq = Omit<IDInstrumentQuoteListRequestDTO, 'offset' | 'pageSize' | 'type'>;

export interface IDInstrumentQuoteListCaseProps extends TListReq {
  type: EDInstrumentQuoteType;
  pageSize?: number;
}

@Injectable()
export class DInstrumentQuoteListCase {
  @observable.ref public props?: IDInstrumentQuoteListCaseProps;

  public quoteListX = this._gw.quoteList({
    name: 'DInstrumentQuoteListCase.QuoteListX', pageSizeKey: 'pageSize', offsetKey: 'offset',
    req: () => this.props ? ({
      pageSize: 20, showParams: true, order: this.sortX.resultSingle, ...this.props, ...this._request,
    }) : undefined,
    getArray: res => res.data, interval: this._cfg.quoteListUpdateInterval,
  });

  public sortX = new DSortX<IDInstrumentQuoteListSort>({
    Volume: { type: EDSortXType.Number },
    Change: { type: EDSortXType.Number },
  }, { single: true });

  @observable.ref private _requestLv: ILambda<TListReq | undefined>;

  @computed
  private get _request() {
    return lambdaResolve(this._requestLv);
  }

  constructor(
    @Inject(DInstrumentGatewayTid) private _gw: DInstrumentGateway,
    @Inject(DInstrumentConfigTid) private _cfg: DInstrumentConfig,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDInstrumentQuoteListCaseProps) {
    this.props = props;
  }

  public dispose() {
    this.sortX.dispose();
  }

  @action
  public requestSet(req: ILambda<TListReq>) {
    this._requestLv = req;
  }
}
