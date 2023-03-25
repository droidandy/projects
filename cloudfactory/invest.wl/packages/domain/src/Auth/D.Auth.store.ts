import { Inject, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { DAuthStoreAdapterTid, IDAuthStoreAdapter } from './D.Auth.types';

@Injectable()
export class DAuthStore {
  constructor(
    @Inject(DAuthStoreAdapterTid) private _store: IDAuthStoreAdapter,
  ) {
    makeObservable(this);
  }

  @computed
  public get authenticated(): boolean {
    return this._store.authenticated;
  }
}
