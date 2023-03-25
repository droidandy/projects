import { MapX } from '@invest.wl/common';
import { Inject, Injectable, TModelId } from '@invest.wl/core';
import flatten from 'lodash/flatten';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { DAuthStore } from '../Auth/D.Auth.store';
import { DAuthStoreTid } from '../Auth/D.Auth.types';
import { DAccountGateway, DAccountGatewayTid } from './D.Account.gateway';
import { DAccountUtil } from './D.Account.util';
import { DAccountByAgreementModelFactoryTid, IDAccountByAgreementModelFactory } from './model/D.AccountByAgreement.model';

export const DAccountStoreTid = Symbol.for('DAccountStore');

@Injectable()
export class DAccountStore {
  @computed
  public get idListSelected() {
    return this._idListSelected;
  }

  @computed
  public get agreementIdListSelected() {
    return this._agreementIdListSelected;
  }

  public listX = this._gw.QUIKList({ name: 'DAccountStore.ListX', req: {} });
  public agreementListX = new MapX.DList(
    this.listX.source,
    () => DAccountUtil.groupByAgreement(DAccountUtil.order(this.listX.source.data?.data)),
    c => this._byAgreementModelFactory(c),
  );

  public listSelectedX = new MapX.DProxyList(
    () => this._idListSelected.length ? this.listX.list.filter(c => this._idListSelected.includes(c.id)) : this.listX.list,
    this.listX.source,
  );
  public agreementListSelectedX = new MapX.DProxyList(
    () => this._agreementIdListSelected.length ? this.agreementListX.list.filter(c =>
      this._agreementIdListSelected.includes(c.id.toString())) : this.agreementListX.list,
    this.listX.source,
  );

  @observable private _idListSelected: TModelId[] = [];
  @observable private _agreementIdListSelected: TModelId[] = [];

  @computed
  public get tradingHave() {
    return !!this.listSelectedX.list.find(a => a.dto.IsTradingAccount);
  }

  constructor(
    @Inject(DAccountGatewayTid) private _gw: DAccountGateway,
    @Inject(DAccountByAgreementModelFactoryTid) private _byAgreementModelFactory: IDAccountByAgreementModelFactory,
    @Inject(DAuthStoreTid) private _authStore: DAuthStore,
  ) {
    makeObservable(this);
    reaction(() => this._authStore.authenticated,
      (authenticated) => authenticated ? this.listX.source.refresh() : this.listX.source.clear());
  }

  @action
  public agreementIdListSelect(idList: TModelId[]) {
    this._agreementIdListSelected = idList;
    this._idListSelected = flatten(this.agreementListX.list
      .filter(c => idList.includes(c.id.toString()))
      .map(c => c.accountIdList));
  }

  @action
  public idListSelect(idList: TModelId[]) {
    this._idListSelected = idList;
    this._agreementIdListSelected = this.agreementListX.list
      .filter(c => c.accountIdList.find(id => idList.includes(id)))
      .map(c => c.id.toString());
  }
}
