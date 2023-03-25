import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { ISSecurityConfig } from '@invest.wl/system/src/Security/S.Security.types';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';

@Injectable()
export class SSecurityConfig implements ISSecurityConfig {
  constructor(
    @Inject(SConfigStoreTid) private cfg: ISConfigStore,
  ) {}

  public biometryAutoUnlock = true;
  public safeDisable = true;

  public get deviceTrusted() {
    return this.cfg.securityDeviceTrusted;
  }
}
