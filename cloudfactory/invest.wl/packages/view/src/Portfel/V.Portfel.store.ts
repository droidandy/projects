import { ILambda } from '@invest.wl/common';
import { EDCurrencyCode, Inject, Injectable } from '@invest.wl/core';
import { DPortfelStore, DPortfelStoreTid } from '@invest.wl/domain';
import { action, computed, makeObservable } from 'mobx';

export const VPortfelStoreTid = Symbol.for('VPortfelStoreTid');

@Injectable()
export class VPortfelStore {
  public currencyList = [EDCurrencyCode.RUR, EDCurrencyCode.EUR, EDCurrencyCode.USD];

  @computed
  public get currency() {
    return this._store.currency;
  }

  constructor(
    @Inject(DPortfelStoreTid) protected _store: DPortfelStore,
  ) {
    makeObservable(this);
  }

  @action.bound
  public currencyToggle() {
    const index = this.currencyList.indexOf(this.currency);
    this.currencySet(index >= (this.currencyList.length - 1) ? this.currencyList[0] : this.currencyList[index + 1]);
  }

  public currencySet = (currency: ILambda<EDCurrencyCode | undefined>) =>
    this._store.currencySet(currency);
}
