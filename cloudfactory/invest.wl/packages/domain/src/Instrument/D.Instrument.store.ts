import { Inject, Injectable } from '@invest.wl/core';
import { action, IObservableArray, makeObservable, observable, reaction } from 'mobx';
import { DAuthStore } from '../Auth/D.Auth.store';
import { DAuthStoreTid } from '../Auth/D.Auth.types';
import { DStorageLocalStore, DStorageLocalStoreTid } from '../StorageLocal/D.StorageLocal.store';

export const DInstrumentStoreTid = Symbol.for('DInstrumentStore');

@Injectable()
export class DInstrumentStore {
  public static searchRecentKey = 'InstrumentSearchRecent';
  @observable public searchRecentList: IObservableArray<string> = [] as unknown as IObservableArray;

  constructor(
    @Inject(DAuthStoreTid) private authStore: DAuthStore,
    @Inject(DStorageLocalStoreTid) private slStore: DStorageLocalStore,
  ) {
    makeObservable(this);
    reaction(() => this.authStore.authenticated,
      (authenticated) => authenticated ? this._refresh() : this._clear());
  }

  @action
  public async searchRecentAdd(text: string) {
    if (this.searchRecentList.includes(text)) return;
    this.searchRecentList.push(text);
    await this._slUpdate();
  }

  @action
  public async searchRecentRemove(text: string) {
    this.searchRecentList.remove(text);
    await this._slUpdate();
  }

  @action
  private _refresh() {
    try {
      const recentList = JSON.parse(this.slStore.get<string>(DInstrumentStore.searchRecentKey) || '[]');
      this.searchRecentList.replace(recentList);
    } catch (e: any) {
    }
  }

  @action
  private _clear() {
    this.searchRecentList.clear();
  }

  private async _slUpdate() {
    await this.slStore.set(DInstrumentStore.searchRecentKey, JSON.stringify(this.searchRecentList));
  }
}
