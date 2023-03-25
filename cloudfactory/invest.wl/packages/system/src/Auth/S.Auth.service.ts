import { DStorageLocalNoAuthKey, EDStorageLocalKey, IDAuthCred, IDAuthSession, IDSecurityPayload, Inject, Injectable } from '@invest.wl/core';
import { action, makeObservable } from 'mobx';
import { ESErrorSystemCode, ISErrorService, SErrorServiceTid } from '../Error/S.Error.types';
import { ISSecurityService, ISSecurityStore, SSecurityServiceTid, SSecurityStoreTid } from '../Security/S.Security.types';
import { ISStorageLocalService, SStorageLocalServiceTid } from '../StorageLocal/S.StorageLocal.types';
import { ISAuthSecurityStrategy, ISAuthService, ISAuthStore, SAuthSecurityStrategyTid, SAuthStoreTid } from './S.Auth.types';

@Injectable()
export class SAuthService implements ISAuthService {
  constructor(
    @Inject(SAuthStoreTid) private _store: ISAuthStore,
    @Inject(SAuthSecurityStrategyTid) private _strategy: ISAuthSecurityStrategy,
    @Inject(SSecurityServiceTid) private _securityService: ISSecurityService,
    @Inject(SSecurityStoreTid) private _securityStore: ISSecurityStore,
    @Inject(SStorageLocalServiceTid) private _sl: ISStorageLocalService,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public async signIn(session: IDAuthSession, cred: IDAuthCred) {
    await this.signOut();
    this._store.sessionSet(session);
    await this._strategy.onSignIn(session, cred);
  }

  @action
  public async signOut() {
    this._store.sessionSet();
    const prefList = await this._sl.getAll();
    const reset = Object.keys(prefList).filter(key => !DStorageLocalNoAuthKey.includes(key as EDStorageLocalKey));
    await Promise.all([this._securityService.clean(), this._sl.remove(...reset)]);
  }

  public sessionRefresh() {
    if (!this._store.refreshToken) {
      throw this._errorService.systemHandle({ code: ESErrorSystemCode.NoRefreshToken });
    }
    return this._strategy.sessionRefresh(this._store.refreshToken);
  }

  public async securityAccess(payload: IDSecurityPayload) {
    await this._strategy.onAccess(payload);
  }

  public async securityLock() {
    if (this._store.authenticated) {
      if (!this._securityStore.unlockCan) {
        await this.signOut();
      } else {
        this._store.sessionSet();
        await this._strategy.onLock();
      }
    }
  }

  public async securityUnlock(payload: IDSecurityPayload) {
    await this._strategy.onUnlock(payload);
  }
}
