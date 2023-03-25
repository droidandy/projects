import { Inject, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { DOrderAdapterTid, EDOrderConfirmStrategy, IDOrderAdapter } from './D.Order.types';

export const DOrderConfigTid = Symbol.for('DOrderConfigTid');

@Injectable()
export class DOrderConfig {
  public confirmStrategy = EDOrderConfirmStrategy.Security;

  @computed
  public get cancelInterval() {
    return this._adapter.cancelInterval;
  }

  @computed
  public get cancelCheckTimeout() {
    return this._adapter.cancelCheckTimeout;
  }

  @computed
  public get createCodeLength() {
    return this._adapter.createCodeLength;
  }

  @computed
  public get createCheckInterval() {
    return this._adapter.createCheckInterval;
  }

  @computed
  public get createCheckTimeout() {
    return this._adapter.createCheckTimeout;
  }

  @computed
  public get createCodeResendInterval() {
    return this._adapter.createCodeResendInterval;
  }

  constructor(
    @Inject(DOrderAdapterTid) private _adapter: IDOrderAdapter,
  ) {
    makeObservable(this);
  }

  public async init() {
  }
}
