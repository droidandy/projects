import { IDAuthCred, IDAuthSession, IDSecurityPayload, Inject, Injectable } from '@invest.wl/core';
import { DAuthServiceAdapterTid, IDAuthServiceAdapter } from './D.Auth.types';

@Injectable()
export class DAuthService {
  constructor(
    @Inject(DAuthServiceAdapterTid) private _service: IDAuthServiceAdapter,
  ) { }

  public signIn(session: IDAuthSession, cred: IDAuthCred) {
    return this._service.signIn(session, cred);
  }

  public signOut() {
    return this._service.signOut();
  }

  public sessionRefresh() {
    return this._service.sessionRefresh();
  }

  public securityAccess(payload: IDSecurityPayload) {
    return this._service.securityAccess(payload);
  }

  public securityLock() {
    return this._service.securityLock();
  }

  public securityUnlock(payload: IDSecurityPayload) {
    return this._service.securityUnlock(payload);
  }
}
