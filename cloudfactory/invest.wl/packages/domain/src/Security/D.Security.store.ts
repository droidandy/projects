import { Inject, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { DSecurityStoreAdapterTid, IDSecurityStoreAdapter } from './D.Security.types';

@Injectable()
export class DSecurityStore {
  constructor(
    @Inject(DSecurityStoreAdapterTid) private _store: IDSecurityStoreAdapter,
  ) {
    makeObservable(this);
  }

  public get isDeviceTrusted() {
    return this._store.isDeviceTrusted;
  }

  @computed
  public get locked() {
    return this._store.locked;
  }

  @computed
  public get unlockCan() {
    return this._store.unlockCan;
  }

  @computed
  public get biometryHas() {
    return !!this.biometryType;
  }

  @computed
  public get biometryType() {
    return this._store.biometryType;
  }

  @computed
  public get biometryAccessed() {
    return this._store.biometryAccessed;
  }

  @computed
  public get codeAccessed() {
    return this._store.codeAccessed;
  }

  @computed
  public get biometryAutoUnlock() {
    return this._store.biometryAutoUnlock;
  }

  @computed
  public get safeDisable() {
    return this._store.safeDisable;
  }
}
