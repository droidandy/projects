import { IocContainer, IocModule } from '@invest.wl/core';

export class SStorageLocalModule extends IocModule {
  public configure(ioc: IocContainer): void {
    // ioc.bind<ISStorageLocalStore>(SStorageLocalStoreTid).to(SStorageLocalStore).inSingletonScope();
  }
}
