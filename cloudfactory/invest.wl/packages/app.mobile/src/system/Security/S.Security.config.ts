import { Inject, Injectable } from '@invest.wl/core';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';
import { ISSecurityConfig } from '@invest.wl/system/src/Security/S.Security.types';

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
