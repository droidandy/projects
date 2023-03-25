import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { ISGeoLocationService, SGeoLocationModule, SGeoLocationServiceTid } from '@invest.wl/system';
import { SGeoLocationMobileService } from './S.GeoLocationMobile.service';

export class SGeoLocationMobileModule extends IocModule {
  private _module = new SGeoLocationModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISGeoLocationService>(SGeoLocationServiceTid).to(SGeoLocationMobileService).inSingletonScope();
    this._module.configure(ioc);
  }

  public init() {
    const service = IoC.get<ISGeoLocationService>(SGeoLocationServiceTid);
    return service.init();
  }
}
