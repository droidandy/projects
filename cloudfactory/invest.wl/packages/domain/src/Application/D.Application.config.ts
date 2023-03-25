import { Inject, Injectable } from '@invest.wl/core';
import { DApplicationAdapterTid, IDApplicationAdapter } from './D.Application.types';

@Injectable()
export class DApplicationConfig {
  constructor(
    @Inject(DApplicationAdapterTid) private _adapter: IDApplicationAdapter,
  ) { }

  public get name() {
    return this._adapter.name;
  }

  public get buildDate() {
    return this._adapter.buildDate;
  }

  public get versionInfo() {
    return this._adapter.versionInfo;
  }

  public get versionBuild() {
    return this._adapter.versionBuild;
  }

  public get versionBuildRevision() {
    return this._adapter.versionBuildRevision;
  }

  public get versionAdviser() {
    return this._adapter.versionAdviser;
  }

  public get versionTarget() {
    return this._adapter.versionTarget;
  }
}
