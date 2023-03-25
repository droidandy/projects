import { IocContainer, IocModule } from '@invest.wl/core';
import { VApplicationVersionPresent, VApplicationVersionPresentTid } from './present/V.ApplicationVersion.present';

export class VApplicationModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VApplicationVersionPresent>(VApplicationVersionPresentTid).to(VApplicationVersionPresent);
  }
}
