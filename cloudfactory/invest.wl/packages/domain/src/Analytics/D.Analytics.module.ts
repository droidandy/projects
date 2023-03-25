import { IocContainer, IocModule } from '@invest.wl/core';
import { DAnalyticsService } from './D.Analytics.service';
import { DAnalyticsServiceTid } from './D.Analytics.types';

export class DAnalyticsModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DAnalyticsService>(DAnalyticsServiceTid).to(DAnalyticsService).inSingletonScope();
  }
}
