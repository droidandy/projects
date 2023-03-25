import { IVOwnerConfig } from '@invest.wl/view/src/Owner/V.Owner.types';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';

@Injectable()
export class VOwnerConfig implements IVOwnerConfig {
  constructor(
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
  ) {}

  public text = this._cfg.ownerDisclaimerIdeaText;
}
