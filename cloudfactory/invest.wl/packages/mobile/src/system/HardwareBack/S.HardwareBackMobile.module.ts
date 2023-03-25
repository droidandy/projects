import { IocContainer, IocModule } from '@invest.wl/core';
import { ISHardwareBackStore, SHardwareBackModule, SHardwareBackStoreTid } from '@invest.wl/system';
import { SHardwareBackMobileStore } from './S.HardwareBackMobile.store';

export class SHardwareBackMobileModule extends IocModule {
  private _module = new SHardwareBackModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISHardwareBackStore>(SHardwareBackStoreTid).to(SHardwareBackMobileStore).inSingletonScope();
    this._module.configure(ioc);
  }

  public init() {
    return this._module.init();
  }
}
