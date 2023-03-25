import { IocContainer, IocModule } from '@invest.wl/core';
import { SLoggerService } from './S.Logger.service';
import { SLoggerServiceTid } from './S.Logger.types';

export class SLoggerModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<SLoggerService>(SLoggerServiceTid).to(SLoggerService).inSingletonScope();
  }
}
