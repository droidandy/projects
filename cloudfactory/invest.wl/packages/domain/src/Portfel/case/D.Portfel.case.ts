import { ILambda, lambdaResolve, MapX } from '@invest.wl/common';

import { EDPortfelGroup, IDPortfelYieldHistoryRequestDTO, Inject, Injectable, Newable, TModelId } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DAccountStore, DAccountStoreTid } from '../../Account/D.Account.store';
import { DDatePeriodModel } from '../../Date/model/D.DatePeriod.model';
import { DInstrumentFilter } from '../../Instrument/util/D.InstrumentFilter.util';
import { DPortfelGateway, DPortfelGatewayTid } from '../D.Portfel.gateway';
import { DPortfelStore, DPortfelStoreTid } from '../D.Portfel.store';
import { DPortfelPLGroupModel, DPortfelPLGroupModelTid, IDPortfelPLGroupDTO } from '../model/D.PortfelPLGroup.model';
import { DPortfelSummaryGroupModel, DPortfelSummaryGroupModelTid, IDPortfelSummaryGroupDTO } from '../model/D.PortfelSummaryGroup.model';

export const DPortfelCaseTid = Symbol.for('DPortfelCaseTid');
type TListReq = Omit<IDPortfelYieldHistoryRequestDTO, 'dateFrom' | 'dateTo' | 'currencyName' | 'agreementIdList'>
& { Period: DDatePeriodModel };

export interface IDPortfelCaseProps {
  // в мобильной версии выборка только по одному Agreement за раз, в Web может быть много
  accountIdList?: TModelId[];
  groupList: EDPortfelGroup[];
}

@Injectable()
export class DPortfelCase<P extends IDPortfelCaseProps = IDPortfelCaseProps> {
  @observable.ref public props?: P;

  @computed
  private get _accountSingleId() {
    return this.props?.accountIdList?.length === 1 ? this.props.accountIdList[0] : undefined;
  }

  // аггрегируем PL для всех переданных AccountId
  public plGroupX = new MapX.D(
    this._store.plByInstrumentListX.source,
    () => this.props ? ({
      id: this._accountSingleId || '-1',
      order: [!!this._accountSingleId ? EDPortfelGroup.AccountId : EDPortfelGroup.All].concat(this.props.groupList),
      list: this._plListOfAccountList.filter(DInstrumentFilter.isPosition),
      data: { marketValueAbs: () => this._mvAbsOfPLFlatList },
    } as IDPortfelPLGroupDTO) : undefined,
    (lv) => new this._plGroupModel(lv),
  );

  // Маржинальные показатели для всех переданных AccountId
  public summaryX = new MapX.D(
    this._store.summaryListX.source,
    () => ({
      id: '-1',
      groupOrder: [EDPortfelGroup.All],
      list: this._store.summaryListX.list.filter(s =>
        this._plListOfAccountList.find(pl => pl.dto.Account.Name === s.dto.Account.Name && pl.dto.Account.MarketType === s.dto.Account.MarketType),
      ),
    } as IDPortfelSummaryGroupDTO),
    (lv) => new this._summaryGroupModel(lv),
  );

  // История доходности портфеля по выбранным AccountId
  public yieldHistoryX = this._gw.yieldHistory({
    name: 'DPortfelCase.YieldHistoryX', req: () => this._request ? {
      accountIdList: this._accountIdList,
      currencyName: this._store.currencyReq,
      agreementIdList: ['-1'],
      dateFrom: this._request.Period.from.format('YYYY-MM-DD'),
      dateTo: this._request.Period.to.format('YYYY-MM-DD'),
    } : undefined,
  });

  @computed
  // аггрегируем PL для всех переданных AccountId
  protected get _plListOfAccountList() {
    const accountIdList = this._accountIdList;
    return this._store.plByInstrumentListX.list.filter(pl =>
      (accountIdList.length ? accountIdList.includes(pl.dto.Account.id) : true),
    );
  }

  @computed
  // суммарный MarketValue по аггрегируемым PL для всех переданных AccountId
  protected get _mvAbsOfPLFlatList() {
    return this._plListOfAccountList.reduce((acc, pl) => acc + pl.marketValueAbs, 0);
  }

  @computed
  protected get _accountIdList() {
    return this._request?.accountIdList ?? this.props?.accountIdList ?? this._accountStore.idListSelected;
  }

  @observable.ref private _requestLv: ILambda<TListReq | undefined>;

  @computed
  protected get _request() {
    return lambdaResolve(this._requestLv);
  }

  constructor(
    @Inject(DPortfelStoreTid) protected _store: DPortfelStore,
    @Inject(DPortfelGatewayTid) protected _gw: DPortfelGateway,
    @Inject(DPortfelPLGroupModelTid) protected _plGroupModel: Newable<typeof DPortfelPLGroupModel>,
    @Inject(DPortfelSummaryGroupModelTid) protected _summaryGroupModel: Newable<typeof DPortfelSummaryGroupModel>,
    @Inject(DAccountStoreTid) protected _accountStore: DAccountStore,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: P) {
    this.props = props;
  }

  public dispose() {
  }

  @action
  public requestSet(req: ILambda<TListReq>) {
    this._requestLv = req;
  }
}
