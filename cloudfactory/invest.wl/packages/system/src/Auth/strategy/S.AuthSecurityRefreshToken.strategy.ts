import { IDAuthCred, IDAuthSession, IDSecurityPayload, Inject, Injectable } from '@invest.wl/core';
import { ISErrorService, SErrorServiceTid } from '../../Error/S.Error.types';
import { ISSecurityService, SSecurityServiceTid } from '../../Security/S.Security.types';
import { ISTransportAuthTwoFactorService, STransportAuthServiceTid } from '../../Transport/S.Transport.types';
import { ISAuthSecurityStrategy, ISAuthStore, SAuthStoreTid } from '../S.Auth.types';

@Injectable()
export class SAuthSecurityRefreshTokenStrategy implements ISAuthSecurityStrategy {
  private _securedData?: IDAuthSession;

  constructor(
    @Inject(SSecurityServiceTid) private _securityService: ISSecurityService,
    @Inject(STransportAuthServiceTid) private _tp: ISTransportAuthTwoFactorService,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) {}

  public async onSignIn(session: IDAuthSession, cred: IDAuthCred) {
    if (!session.refreshToken) throw this._errorService.systemHandle('No refresh token received');
    this._securedData = session;
  }

  public async onAccess(payload: IDSecurityPayload) {
    if (!this._securedData) {
      this._securedData = { refreshToken: await this._securityService.read() } as IDAuthSession;
      if (!this._securedData || !this._securedData.refreshToken) throw this._errorService.systemHandle('No refresh token saved');
    }
    if (!this._securedData.refreshToken) throw this._errorService.systemHandle('No refresh token received');
    await this._securityService.accessRequestAndDataSave(payload, this._securedData.refreshToken);
    this._securedData = undefined;
  }

  public onLock() {
    return this._securityService.lock();
  }

  public onUnlock(payload: IDSecurityPayload) {
    return this.sessionRefreshBySecurity(payload);
  }

  public async sessionRefreshBySecurity(payload: IDSecurityPayload) {
    const refreshToken = await this._securityService.dataGet(payload);
    if (!refreshToken) throw this._errorService.systemHandle('No saved refresh token');
    await this.sessionRefresh(refreshToken);
  }

  public async sessionRefresh(refreshToken: string) {
    const session = await this._tp.Refresh({ refreshToken });
    this._authStore.sessionSet(session);
    if (!session.refreshToken) throw this._errorService.systemHandle('No refresh token received');
    await this._securityService.dataSave(session.refreshToken);
    return session;
  }
}
