import { ISApplicationListener, SApplicationListenerTid } from '@invest.wl/system/src/Application/S.Application.types';
import { SApplicationWebListener } from './S.ApplicationWeb.listener';
import { IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { SApplicationModule } from '@invest.wl/system/src/Application/S.Application.module';

export class SApplicationWebModule extends IocModule {
  private _module = new SApplicationModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISApplicationListener>(SApplicationListenerTid).to(SApplicationWebListener).inSingletonScope();
    this._module.configure(ioc);
  }

  public async init() {
    return this._module.init();
  }
}
