import { IDAuthSession, Inject, Injectable } from '@invest.wl/core';
import { DDateUtil } from '@invest.wl/domain';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { ISStorageLocalService, SStorageLocalServiceTid } from '../StorageLocal/S.StorageLocal.types';
import { ISAuthStore } from './S.Auth.types';

const devSessionTokenKey = '__dev_token__';
const isDevSessionPersistEnabled = __DEV__;

@Injectable()
export class SAuthStore implements ISAuthStore {
  @observable.ref private _session?: IDAuthSession = undefined;

  @computed
  public get token() {
    return this._session?.accessToken;
  }

  @computed
  public get refreshToken() {
    return this._session?.refreshToken;
  }

  @computed
  public get authenticated() {
    return !!this.token;
  }

  constructor(
    @Inject(SStorageLocalServiceTid) private _sl: ISStorageLocalService,
  ) {
    makeObservable(this);
  }

  public async init() {
    if (!this.authenticated) await this.sessionDevRestore();
  }

  @action
  public sessionSet(session?: IDAuthSession) {
    this._session = session;
    this.sessionDevSet(this._session).then();
  }

  public get refreshNeed() {
    if (this._session?.expiresIn) {
      const milliseconds = this._session.expiresIn.getTime() - Date.now() - (30 * DDateUtil.SECOND);
      return milliseconds <= 0;
    }
    return false;
  }

  private async sessionDevSet(data?: IDAuthSession) {
    if (!isDevSessionPersistEnabled) return;
    if (data) {
      data = { refreshToken: data.refreshToken, accessToken: data.accessToken };
      console.log('S.Auth.store:devSessionSet', data); // ✅
      await this._sl.set(devSessionTokenKey, JSON.stringify(data));
    } else {
      this._sl.remove(devSessionTokenKey).then();
    }
  }

  private async sessionDev() {
    try {
      const data: IDAuthSession = JSON.parse(await this._sl.get(devSessionTokenKey));
      console.log('S.Auth.store:devSession', data); // ✅
      return data;
    } catch (e: any) {
      return;
    }
  }

  private async sessionDevRestore() {
    if (isDevSessionPersistEnabled) {
      const session = await this.sessionDev();
      runInAction(() => (this._session = session));
    }
  }
}
