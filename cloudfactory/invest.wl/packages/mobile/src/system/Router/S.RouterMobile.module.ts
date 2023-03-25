import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { ISRouterService, ISRouterStore, SRouterListenerTid, SRouterModule, SRouterServiceTid, SRouterStoreTid } from '@invest.wl/system';
import { SRouterMobileListener } from './S.RouterMobile.listener';
import { SRouterMobileService } from './S.RouterMobile.service';
import { SRouterMobileStore } from './S.RouterMobile.store';

export class SRouterMobileModule extends IocModule {
  private _module = new SRouterModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISRouterStore>(SRouterStoreTid).to(SRouterMobileStore).inSingletonScope();
    ioc.bind<ISRouterService>(SRouterServiceTid).to(SRouterMobileService).inSingletonScope();
    ioc.bind<SRouterMobileListener>(SRouterListenerTid).to(SRouterMobileListener).inSingletonScope();
    this._module.configure(ioc);
  }

  public async init() {
    const _listener = IoC.get<SRouterMobileListener>(SRouterListenerTid);
    return Promise.all([_listener.init(), this._module.init()]);
  }
}
