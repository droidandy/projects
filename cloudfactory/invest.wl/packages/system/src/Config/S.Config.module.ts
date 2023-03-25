import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { SConfigService } from './S.Config.service';
import { SConfigStore } from './S.Config.store';
import { ISConfigStore, ISConfigStoreConfigurator, SConfigConfiguratorTid, SConfigServiceTid, SConfigStoreTid } from './S.Config.types';

export class SConfigModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<SConfigService>(SConfigServiceTid).to(SConfigService).inSingletonScope();
    ioc.bind<ISConfigStore>(SConfigStoreTid).to(SConfigStore).inSingletonScope();
    ioc.bind<ISConfigStoreConfigurator>(SConfigConfiguratorTid).toService(SConfigStoreTid);
  }

  public preload() {
    const service = IoC.get<SConfigService>(SConfigServiceTid);
    return service.systemLoad();
  }
}
