import { Inject, Injectable } from '@invest.wl/core';
import { IDApplicationAdapter } from '@invest.wl/domain/src/Application/D.Application.types';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';

@Injectable()
export class DApplicationAdapter implements IDApplicationAdapter {
  constructor(
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
  ) {}

  public get name() {
    return this._cfg.appName;
  }

  public get buildDate() {
    return this._cfg.appBuildDate;
  }

  public get versionInfo() {
    return this._cfg.appVersionInfo;
  }

  public get versionBuild() {
    return this._cfg.appVersionBuild;
  }

  public get versionBuildRevision() {
    return this._cfg.appVersionBuildRevision;
  }

  public get versionAdviser() {
    return this._cfg.appVersionAdviser;
  }

  public get versionTarget() {
    return this._cfg.appVersionTarget;
  }
}
