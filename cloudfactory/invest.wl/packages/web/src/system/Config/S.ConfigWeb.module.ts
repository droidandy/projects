import { ISConfigSource, SConfigSourceTid } from '@invest.wl/system/src/Config/S.Config.types';
import { IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { SConfigModule } from '@invest.wl/system/src/Config/S.Config.module';
import { SConfigWebSource } from './S.ConfigWeb.source';

export class SConfigWebModule extends IocModule {
  private _module = new SConfigModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISConfigSource>(SConfigSourceTid).toConstantValue(SConfigWebSource);
    this._module.configure(ioc);
  }

  public preload() {
    return this._module.preload();
  }
}
