import { EDAuthStrategy, Injectable } from '@invest.wl/core';
import { ISAuthConfig } from '@invest.wl/system/src/Auth/S.Auth.types';

@Injectable()
export class SAuthConfig implements ISAuthConfig {
  constructor(
    // @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
  ) {}

  public get strategy() {
    return EDAuthStrategy.RefreshToken;
    // return this._cfg.systemConfigUrl?.includes('rshb') || this._cfg.systemConfigUrl?.includes('wlinvest') ? EDAuthStrategy.RefreshToken : EDAuthStrategy.Cred;
  }
}
