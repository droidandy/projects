import { ILambda, lambdaResolve } from '@invest.wl/common';
import { EDInstrumentAlertStatus, IDInstrumentAlertListRequestDTO, Inject, Injectable, TModelId } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DInstrumentAlertConfig, DInstrumentAlertConfigTid } from '../D.InstrumentAlert.config';
import { DInstrumentAlertGateway, DInstrumentAlertGatewayTid } from '../D.InstrumentAlert.gateway';
import { DInstrumentAlertStore, DInstrumentAlertStoreTid } from '../D.InstrumentAlert.store';
import { IDInstrumentAlertModel } from '../model/D.InstrumentAlert.model';

export const DInstrumentAlertListCaseTid = Symbol.for('DInstrumentAlertListCaseTid');
type TListReq = Omit<IDInstrumentAlertListRequestDTO, 'offset' | 'pageSize'>;

export interface IDInstrumentAlertListCaseProps extends TListReq {
  pageSize?: number;
}

@Injectable()
export class DInstrumentAlertListCase {
  @observable.ref public props?: IDInstrumentAlertListCaseProps;

  public listX = this._gw.list({
    name: 'DInstrumentAlertListCase.ListX',
    req: () => this.props ? ({ pageSize: 10, ...this.props, ...this._request }) : undefined,
    pageSizeKey: 'pageSize', offsetKey: 'offset', getArray: res => res.data,
    interval: this._cfg.updateInterval,
  });

  @observable.ref private _requestLv: ILambda<TListReq | undefined>;

  @computed
  private get _request() {
    return lambdaResolve(this._requestLv);
  }

  constructor(
    @Inject(DInstrumentAlertGatewayTid) private _gw: DInstrumentAlertGateway,
    @Inject(DInstrumentAlertStoreTid) private _store: DInstrumentAlertStore,
    @Inject(DInstrumentAlertConfigTid) private _cfg: DInstrumentAlertConfig,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDInstrumentAlertListCaseProps) {
    this.props = props;
  }

  @action
  public requestSet(req: ILambda<TListReq>) {
    this._requestLv = req;
  }

  public async delete(id: TModelId) {
    const res = await this._gw.listDelete({ idList: [id] });
    this.listX.source.refresh();
    return res;
  }

  public async listDelete(idList: TModelId[]) {
    const res = await this._gw.listDelete({ idList });
    this.listX.source.refresh();
    return res;
  }

  public async viewedUpdate(list: IDInstrumentAlertModel[]) {
    const completedList = list.filter(m => m.status === EDInstrumentAlertStatus.Completed && m.id);
    if (!completedList.length) return;
    const idList = completedList.map(m => m.id.toString());
    const res = await this._gw.viewedUpdate({ idList });
    completedList.forEach(a => { a.status = EDInstrumentAlertStatus.ExecutedAndViewed; });
    this._store.countX.source.refresh().then();
    return res;
  }
}
