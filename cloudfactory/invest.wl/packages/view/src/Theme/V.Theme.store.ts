import { EDStorageLocalKey, Inject, Injectable, IoC } from '@invest.wl/core';
import { ISStorageLocalService, SStorageLocalServiceTid } from '@invest.wl/system';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { IVThemeAdapter, IVThemeModel, IVThemeStore, VThemeAdapterTid, VThemeStoreTid } from './V.Theme.types';

export const useTheme = () => {
  return [IoC.get<VThemeStore>(VThemeStoreTid)];
};

@Injectable()
export class VThemeStore implements IVThemeStore {
  @observable.ref private _current?: IVThemeModel;

  @computed
  public get current() {
    return this._current || this._adapter.list[0];
  }

  @computed
  public get color() {
    return this.current.color;
  }

  @computed
  public get space() {
    return this.current.space;
  }

  @computed
  public get font() {
    return this.current.font;
  }

  @computed
  public get kit() {
    return this.current.kit;
  }

  constructor(
    @Inject(SStorageLocalServiceTid) private _sl: ISStorageLocalService,
    @Inject(VThemeAdapterTid) private _adapter: IVThemeAdapter,
  ) {
    makeObservable(this);
  }

  public async init() {
    await this._refresh();
  }

  @action
  public async currentSet(theme: IVThemeModel): Promise<void> {
    this._current = theme;
    await this._sl.set(EDStorageLocalKey.Theme, theme.name);
  }

  private async _refresh() {
    const name = await this._sl.get(EDStorageLocalKey.Theme);
    const theme = this._adapter.list.find(t => t.name === name) || this._adapter.list[0];

    runInAction(() => {
      this._current = theme;
    });
  }
}
