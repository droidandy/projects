import { EDApplicationState, EDStorageLocalKey, Inject, Injectable } from '@invest.wl/core';
import { computed, makeObservable, observable } from 'mobx';
import { ISAuthStore, SAuthStoreTid } from '../Auth/S.Auth.types';
import { ISConfigStore, SConfigStoreTid } from '../Config/S.Config.types';
import { ISNetworkStore, SNetworkStoreTid } from '../Network/S.Network.types';
import { ISStorageLocalService, SStorageLocalServiceTid } from '../StorageLocal/S.StorageLocal.types';

import { ISApplicationStore } from './S.Application.types';
import { SApplicationUtil } from './S.Application.util';

@Injectable()
export class SApplicationStore implements ISApplicationStore {
  @observable private _state: EDApplicationState = EDApplicationState.inactive;
  private _currentVersion: string = '';

  @computed
  public get state(): EDApplicationState {
    return this._state;
  }

  public set state(appState: EDApplicationState) {
    this._state = appState;
  }

  constructor(
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
    @Inject(SNetworkStoreTid) private _networkStore: ISNetworkStore,
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
    @Inject(SStorageLocalServiceTid) private _sl: ISStorageLocalService,
  ) {
    makeObservable(this);
  }

  public async init() {
    this._currentVersion = await this._sl.get(EDStorageLocalKey.ApplicationVersion) ?? '';
    await this._sl.set(EDStorageLocalKey.ApplicationVersion, this._cfg.appVersionBuild);
  }

  @computed
  public get isUseful() {
    const isAppActive = this.state === EDApplicationState.active;
    const isAuthenticated = this._authStore.authenticated;
    const isAuthorized = !this._networkStore.isUnauthorized;
    const isNetworkOk = !this._networkStore.isNetwork;
    // TODO: check?
    // const isConfigOk = this._cfg.IsUserLoaded;

    return isAuthorized && isAppActive && isAuthenticated && isNetworkOk; // && isConfigOk;
  }

  @computed
  public get isUsefulBg() {
    return this.isUseful;
  }

  public get needUpdate() {
    return SApplicationUtil.isVersionLess(this._cfg.appVersionBuild, this._cfg.appVersionTarget);
  }

  public get isNewVersion() {
    return SApplicationUtil.isVersionLess(this._currentVersion, this._cfg.appVersionBuild);
  }
}
