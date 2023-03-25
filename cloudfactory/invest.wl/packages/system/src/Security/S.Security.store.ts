import { EDSecurityBiometryType, EDSecurityType, EDStorageLocalKey, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { ISStorageLocalService, SStorageLocalServiceTid } from '../StorageLocal/S.StorageLocal.types';
import { ISSecurityConfig, ISSecurityStore, SSecurityConfigTid } from './S.Security.types';

@Injectable()
export class SSecurityStore implements ISSecurityStore {
  public static accessBy2Pref: { [T in EDSecurityType]: string } = {
    [EDSecurityType.CODE]: EDStorageLocalKey.SecurityCodeGranted,
    [EDSecurityType.BIO]: EDStorageLocalKey.SecurityBiometryGranted,
  };

  @observable private _accessBy: { [T in EDSecurityType]: boolean } = {
    [EDSecurityType.CODE]: false,
    [EDSecurityType.BIO]: false,
  };

  public get isDeviceTrusted(): boolean {
    return this._cfg.deviceTrusted || true;
  }

  @computed
  public get codeAccessed() {
    return this._accessBy[EDSecurityType.CODE];
  }

  @computed
  public get biometryAccessed() {
    return !!this.biometryType && this._accessBy[EDSecurityType.BIO];
  }

  @observable public locked = false;
  @observable public biometryType?: EDSecurityBiometryType;

  @computed
  public get unlockCan() {
    return this.codeAccessed || this.biometryAccessed;
  }

  @computed
  public get biometryAutoUnlock() {
    return this.biometryAccessed ?? this._cfg.biometryAutoUnlock;
  }

  @computed
  public get safeDisable() {
    return this._cfg.safeDisable;
  }

  constructor(
    @Inject(SStorageLocalServiceTid) private _sl: ISStorageLocalService,
    @Inject(SSecurityConfigTid) protected _cfg: ISSecurityConfig,
  ) {
    makeObservable(this);
  }

  public async init() {
    const [biometryEnabled, codeEnabled] = await Promise.all([
      this._sl.get(SSecurityStore.accessBy2Pref[EDSecurityType.BIO]),
      this._sl.get(SSecurityStore.accessBy2Pref[EDSecurityType.CODE]),
    ]);
    runInAction(() => {
      this._accessBy[EDSecurityType.BIO] = biometryEnabled === 'true';
      this._accessBy[EDSecurityType.CODE] = codeEnabled === 'true';
    });
    // если в прошлой сессии остались хоть один доступ - значит при старте хранилище будет залочено
    if (this.unlockCan) this.locked = true;
  }

  @action
  public async accessSet(type: EDSecurityType, isAccessible = false) {
    this._accessBy[type] = isAccessible;
    if (isAccessible) this.locked = false;
    await this._sl.set(SSecurityStore.accessBy2Pref[type], isAccessible.toString());
  }

  @action
  public lockedSet(locked: boolean) {
    this.locked = locked;
  }

  public async clear() {
    await Promise.all([this.accessSet(EDSecurityType.BIO), this.accessSet(EDSecurityType.CODE)]);
  }
}
