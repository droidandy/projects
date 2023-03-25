import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { ISRouterStore, SRouterStoreTid } from '@invest.wl/system';
import { VRouterListener } from './V.Router.listener';
import { VRouterService } from './V.Router.service';
import { IVRouterService, VRouterListenerTid, VRouterScreenList, VRouterServiceTid } from './V.Router.types';

export class VRouterModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<IVRouterService>(VRouterServiceTid).to(VRouterService).inSingletonScope();
    ioc.bind<VRouterListener>(VRouterListenerTid).to(VRouterListener).inSingletonScope();
  }

  public async init() {
    const store = IoC.get<ISRouterStore>(SRouterStoreTid);
    const listener = IoC.get<VRouterListener>(VRouterListenerTid);
    return Promise.all([store.init(VRouterScreenList), listener.init()]);
  }
}
