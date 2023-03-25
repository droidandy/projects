import { IocContainer, IocModule } from '@invest.wl/core';
import { ISConfigSource, SConfigModule, SConfigSourceTid } from '@invest.wl/system';
import { SConfigMobileSource } from './S.ConfigMobile.source';

export class SConfigMobileModule extends IocModule {
  private _module = new SConfigModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISConfigSource>(SConfigSourceTid).toConstantValue(SConfigMobileSource);
    this._module.configure(ioc);
  }

  public preload() {
    return this._module.preload();
  }
}
