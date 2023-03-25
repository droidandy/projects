import { ILambda, lambdaResolve, MapX } from '@invest.wl/common';
import { EDCurrencyCode, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';
import moment from 'moment';
import { DAccountStore, DAccountStoreTid } from '../Account/D.Account.store';
import { DAuthStore } from '../Auth/D.Auth.store';
import { DAuthStoreTid } from '../Auth/D.Auth.types';
import { DDatePeriodModel } from '../Date/model/D.DatePeriod.model';
import { DPortfelGateway, DPortfelGatewayTid } from './D.Portfel.gateway';
import { DPortfelConfigTid, IDPortfelConfig } from './D.Portfel.types';

export const DPortfelStoreTid = Symbol.for('DPortfelStoreTid');

@Injectable()
export class DPortfelStore {
  public static currencyDefault = EDCurrencyCode.RUR;

  @observable protected _currencyLv: ILambda<EDCurrencyCode | undefined>;

  @computed
  public get currencyReq() {
    return lambdaResolve(this._currencyLv) || DPortfelStore.currencyDefault;
  }

  @observable public currency = DPortfelStore.currencyDefault;
  protected _currencySync = () =>
    this.currency !== this.currencyReq && runInAction(() => this.currency = this.currencyReq);
  public period = new DDatePeriodModel([moment(), moment()]);

  public summaryListX = this._gw.summary({
    name: 'DPortfelStore.SummaryListX', req: () => this._authStore.authenticated ? {
      agreementIdList: ['-1'], currencyName: this.currencyReq,
      accountIdList: this._accountStore.idListSelected,
      dateFrom: this.period.from.format('YYYY-MM-DD'),
      dateTo: this.period.to.format('YYYY-MM-DD'),
    } : undefined,
    onLoaded: this._currencySync,
  }, { currency: () => this.currency });

  public plByInstrumentListX = this._gw.plByInstrument({
    name: 'DPortfelStore.PLByInstrumentListX', req: () => this._authStore.authenticated ? {
      agreementIdList: ['-1'], currencyName: this.currencyReq,
      accountIdList: this._accountStore.idListSelected,
      dateFrom: this.period.from.format('YYYY-MM-DD'),
      dateTo: this.period.to.format('YYYY-MM-DD'),
    } : undefined, interval: this._cfg.plUpdateInterval,
    onLoaded: this._currencySync,
  }, { currency: () => this.currency });

  public plByInstrumentListOfAgreementSelectedX = new MapX.DProxyList(
    () => {
      const selected = this._accountStore.agreementListSelectedX.list;
      return this.plByInstrumentListX.list
        .filter(pl => selected.find(c => c.accountIdList.includes(pl.dto.Account.id)));
    },
    this.plByInstrumentListX.source,
  );

  @computed
  public get mv() {
    return this.plByInstrumentListX.list.reduce((acc, pl) => acc + pl.marketValue, 0);
  }

  @computed
  public get mvAbs() {
    return this.plByInstrumentListX.list.reduce((acc, pl) => acc + pl.marketValueAbs, 0);
  }

  @computed
  public get mvOfAgreementSelected() {
    return this.plByInstrumentListOfAgreementSelectedX.list.reduce((acc, pl) => acc + pl.marketValue, 0);
  }

  @computed
  public get mvAbsOfAgreementSelected() {
    return this.plByInstrumentListOfAgreementSelectedX.list.reduce((acc, pl) => acc + pl.marketValueAbs, 0);
  }

  constructor(
    @Inject(DPortfelConfigTid) protected _cfg: IDPortfelConfig,
    @Inject(DPortfelGatewayTid) protected _gw: DPortfelGateway,
    @Inject(DAccountStoreTid) protected _accountStore: DAccountStore,
    @Inject(DAuthStoreTid) protected _authStore: DAuthStore,
  ) {
    makeObservable(this);
    reaction(() => this._authStore.authenticated,
      (authenticated) => {
        if (authenticated) {
          // this.SummaryListX.Source.refresh().then();
          this.plByInstrumentListX.source.refresh().then();
        } else {
          // this.SummaryListX.Source.clear();
          this.plByInstrumentListX.source.clear();
        }
      });
  }

  @action
  public currencySet(currency: ILambda<EDCurrencyCode | undefined>) {
    this._currencyLv = currency;
  }
}
