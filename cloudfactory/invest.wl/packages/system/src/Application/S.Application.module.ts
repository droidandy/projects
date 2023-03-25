import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { SApplicationStore } from './S.Application.store';
import { ISApplicationListener, ISApplicationStore, SApplicationListenerTid, SApplicationStoreTid } from './S.Application.types';

export class SApplicationModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<ISApplicationStore>(SApplicationStoreTid).to(SApplicationStore).inSingletonScope();
  }

  public async init() {
    const _listener = IoC.get<ISApplicationListener>(SApplicationListenerTid);
    const _store = IoC.get<ISApplicationStore>(SApplicationStoreTid);
    return Promise.all([_listener.init(), _store.init()]);
  }
}
