import { SHardwareBackWebStore } from './S.HardwareBackWeb.store';
import { IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { SHardwareBackModule } from '@invest.wl/system/src/HardwareBack/S.HardwareBack.module';
import { ISHardwareBackStore, SHardwareBackStoreTid } from '@invest.wl/system/src/HardwareBack/S.HardwareBack.types';

export class SHardwareBackWebModule extends IocModule {
  private _module = new SHardwareBackModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISHardwareBackStore>(SHardwareBackStoreTid).to(SHardwareBackWebStore).inSingletonScope();
    this._module.configure(ioc);
  }

  public init() {
    return this._module.init();
  }
}
