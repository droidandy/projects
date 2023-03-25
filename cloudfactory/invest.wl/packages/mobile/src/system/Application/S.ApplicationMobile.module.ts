import { IocContainer, IocModule } from '@invest.wl/core';
import { ISApplicationListener, SApplicationListenerTid, SApplicationModule } from '@invest.wl/system';
import { SApplicationMobileListener } from './S.ApplicationMobile.listener';

export class SApplicationMobileModule extends IocModule {
  private _module = new SApplicationModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISApplicationListener>(SApplicationListenerTid).to(SApplicationMobileListener).inSingletonScope();
    this._module.configure(ioc);
  }

  public async init() {
    return this._module.init();
  }
}
