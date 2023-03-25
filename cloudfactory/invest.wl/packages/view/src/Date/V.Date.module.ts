import { IocContainer, IocModule } from '@invest.wl/core';
import { VDateI18n } from './V.Date.i18n';
import { IVDateI18n, VDateI18nTid } from './V.Date.types';

export class VDateModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<IVDateI18n>(VDateI18nTid).to(VDateI18n);
  }
}
