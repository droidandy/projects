import { EDStorageLocalKey, Inject, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { v1 } from 'uuid';
import { DStorageLocalStore, DStorageLocalStoreTid } from '../StorageLocal/D.StorageLocal.store';
import { DApplicationStoreAdapterTid, IDApplicationStoreAdapter } from './D.Application.types';

@Injectable()
export class DApplicationStore {
  constructor(
    @Inject(DApplicationStoreAdapterTid) private _store: IDApplicationStoreAdapter,
    @Inject(DStorageLocalStoreTid) private _sl: DStorageLocalStore,
  ) {
    makeObservable(this);
  }

  public init() {
    return this._firstLaunch();
  }

  @computed
  public get state() {
    return this._store.state;
  }

  @computed
  public get isUseful() {
    return this._store.isUseful;
  }

  @computed
  public get isUsefulBg() {
    return this._store.isUsefulBg;
  }

  @computed
  public get needUpdate() {
    return this._store.needUpdate;
  }

  @computed
  public get isNewVersion() {
    return this._store.isNewVersion;
  }

  private async _firstLaunch() {
    const firstLaunchDate = await this._sl.get(EDStorageLocalKey.ApplicationFirstLaunchDate);
    if (!firstLaunchDate) await this._sl.set(EDStorageLocalKey.ApplicationFirstLaunchDate, new Date() + '');

    const appInstanceId = await this._sl.get(EDStorageLocalKey.ApplicationInstanceId);
    const isFirstLaunchAfterInstall = !appInstanceId;
    if (isFirstLaunchAfterInstall) {
      const newAppInstanceId = v1();
      await this._sl.set(EDStorageLocalKey.ApplicationInstanceId, newAppInstanceId);
    }
  }
}
