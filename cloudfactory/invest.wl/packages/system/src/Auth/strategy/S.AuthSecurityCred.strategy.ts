import { IDAuthCred, IDAuthSession, IDSecurityPayload, Inject, Injectable } from '@invest.wl/core';
import { ISErrorService, SErrorServiceTid } from '../../Error/S.Error.types';
import { ISSecurityService, SSecurityServiceTid } from '../../Security/S.Security.types';
import { ISTransportAuthSimpleService, STransportAuthServiceTid } from '../../Transport/S.Transport.types';
import { ISAuthSecurityStrategy, ISAuthStore, SAuthStoreTid } from '../S.Auth.types';

@Injectable()
export class SAuthSecurityCredStrategy implements ISAuthSecurityStrategy {
  private _securedData?: IDAuthCred;

  constructor(
    @Inject(SSecurityServiceTid) private _securityService: ISSecurityService,
    @Inject(STransportAuthServiceTid) private _tp: ISTransportAuthSimpleService,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) {}

  public async onSignIn(session: IDAuthSession, cred: IDAuthCred) {
    this._securedData = cred;
  }

  public async onAccess(payload: IDSecurityPayload) {
    if (!this._securedData) {
      try {
        this._securedData = JSON.parse(await this._securityService.read() ?? '') as IDAuthCred;
        if (!this._securedData || !this._securedData.password) throw new Error('No cred saved');
      } catch (e: any) {
        throw this._errorService.systemHandle(e);
      }
    }
    await this._securityService.accessRequestAndDataSave(payload, JSON.stringify(this._securedData));
    this._securedData = undefined;
  }

  public onLock() {
    return this._securityService.lock();
  }

  public onUnlock(payload: IDSecurityPayload) {
    return this.sessionRefreshBySecurity(payload);
  }

  public async sessionRefreshBySecurity(payload: IDSecurityPayload) {
    const credJson = await this._securityService.dataGet(payload);
    if (!credJson) throw this._errorService.systemHandle('No saved cred');
    let cred: IDAuthCred;
    try {
      cred = JSON.parse(credJson);
    } catch (e: any) {
      throw this._errorService.systemHandle(e);
    }
    const session = await this._tp.Login(cred);
    this._authStore.sessionSet(session);
  }

  public async sessionRefresh(refreshToken: string) {
    throw this._errorService.systemHandle('cant refresh in cred auth');
    return '' as any;
  }
}
