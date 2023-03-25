import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { DStorageLocalStore, DStorageLocalStoreTid } from './D.StorageLocal.store';

export class DStorageLocalModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DStorageLocalStore>(DStorageLocalStoreTid).to(DStorageLocalStore).inSingletonScope();
  }

  public preload() {
    const _store = IoC.get<DStorageLocalStore>(DStorageLocalStoreTid);
    return Promise.all([_store.init()]);
  }
}
