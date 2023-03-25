import { IocContainer, IocModule } from '@invest.wl/core';

export class SGeoLocationModule extends IocModule {
  public configure(ioc: IocContainer): void {
    // ioc.bind<ISGeoLocationService>(SGeoLocationServiceTid).to(SGeoLocationWebService).inSingletonScope();
  }
}
