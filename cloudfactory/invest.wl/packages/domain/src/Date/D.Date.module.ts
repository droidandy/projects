import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { DDateConfig, DDateConfigTid } from './D.Date.config';

export class DDateModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DDateConfig>(DDateConfigTid).to(DDateConfig).inSingletonScope();
  }

  public async init() {
    const cfg = IoC.get<DDateConfig>(DDateConfigTid);
    await cfg.init();
  }
}
