import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { SSecurityStore } from './S.Security.store';
import { ISSecurityListener, ISSecurityStore, SSecurityListenerTid, SSecurityStoreTid } from './S.Security.types';

export class SSecurityModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<SSecurityStore>(SSecurityStoreTid).to(SSecurityStore).inSingletonScope();
  }

  public init() {
    const _listener = IoC.get<ISSecurityListener>(SSecurityListenerTid);
    const _store = IoC.get<ISSecurityStore>(SSecurityStoreTid);
    return Promise.all([_listener.init(), _store.init()]);
  }
}
