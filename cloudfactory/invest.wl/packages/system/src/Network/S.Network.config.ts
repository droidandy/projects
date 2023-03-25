import { Inject, Injectable } from '@invest.wl/core';
import { ISConfigStore, SConfigStoreTid } from '../Config/S.Config.types';
import { ESNetworkStatus, ISNetworkConfig } from './S.Network.types';

@Injectable()
export class SNetworkConfig implements ISNetworkConfig {
  public get tokenMode() {
    return this._cfg.networkTokenTransferMode;
  }

  public responseOk = [ESNetworkStatus.OK];

  constructor(
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
  ) {}
}
