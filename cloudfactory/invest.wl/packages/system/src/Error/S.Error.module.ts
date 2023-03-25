import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { SErrorConfig } from './S.Error.config';
import { SErrorService } from './S.Error.service';
import { SErrorStore } from './S.Error.store';
import { ISErrorConfig, ISErrorStore, SErrorConfigTid, SErrorServiceTid, SErrorStoreTid } from './S.Error.types';

export class SErrorModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<ISErrorConfig>(SErrorConfigTid).to(SErrorConfig).inSingletonScope();
    ioc.bind<ISErrorStore>(SErrorStoreTid).to(SErrorStore).inSingletonScope();
    ioc.bind<SErrorService>(SErrorServiceTid).to(SErrorService).inSingletonScope();
  }

  public init() {
    const store = IoC.get<ISErrorStore>(SErrorStoreTid);
    return store.init();
  }
}
