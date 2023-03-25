import { IocContainer, IocModule } from '@invest.wl/core';
import { DApplicationVersionCase, DApplicationVersionCaseTid } from './case/D.ApplicationVersion.case';
import { DApplicationConfig } from './D.Application.config';
import { DApplicationStore } from './D.Application.store';
import { DApplicationConfigTid, DApplicationStoreTid } from './D.Application.types';

export class DApplicationModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DApplicationStore>(DApplicationStoreTid).to(DApplicationStore).inSingletonScope();
    ioc.bind<DApplicationConfig>(DApplicationConfigTid).to(DApplicationConfig).inSingletonScope();
    ioc.bind<DApplicationVersionCase>(DApplicationVersionCaseTid).to(DApplicationVersionCase);
  }
}
