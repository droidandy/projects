import { IDStorageLocalDTO, Inject, Injectable, TDStorageLocalValue } from '@invest.wl/core';
import clone from 'lodash/clone';
import { action, makeObservable, observable, runInAction, set } from 'mobx';
import { DStorageLocalStoreAdapterTid, IDStorageLocalStoreAdapter } from './D.StorageLocal.types';

export const DStorageLocalStoreTid = Symbol.for('DStorageLocalStoreTid');

@Injectable()
export class DStorageLocalStore {
  @observable private _map: IDStorageLocalDTO = {};

  constructor(
    @Inject(DStorageLocalStoreAdapterTid) private _adapter: IDStorageLocalStoreAdapter,
  ) {
    makeObservable(this);
  }

  public async init() {
    const res = await this._adapter.getAll();
    runInAction(() => (this._map = res));
  }

  public get<V>(key: string) {
    return this._map[key];
  }

  @action
  public set(key: string, value: TDStorageLocalValue) {
    const backup = this._map[key];
    set(this._map, key, value);
    this._adapter.set(key, value).catch(() => {
      runInAction(() => this._map[key] = backup);
    });
  }

  @action
  public remove(...keys: string[]) {
    const backup = clone(this._map);
    keys.forEach(k => this._map[k] = undefined);
    this._adapter.remove(...keys).catch(() => {
      runInAction(() => this._map = backup);
    });
  }
}
