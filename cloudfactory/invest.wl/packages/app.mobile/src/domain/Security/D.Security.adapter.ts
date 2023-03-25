import { Inject, Injectable } from '@invest.wl/core';
import { IDSecurityAdapter } from '@invest.wl/domain/src/Security/D.Security.types';
import { SConfigStore } from '@invest.wl/system/src/Config/S.Config.store';
import { SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';

@Injectable()
export class DSecurityAdapter implements IDSecurityAdapter {
  constructor(
    @Inject(SConfigStoreTid) private _cfg: SConfigStore,
  ) {}

  public get codeLength() {
    return this._cfg.securityCodeLength;
  }

  public get codeDefault() {
    return this._cfg.securityCodeDefault;
  }

  public get timeoutToLock() {
    return this._cfg.securityTimeoutToLock;
  }
}
