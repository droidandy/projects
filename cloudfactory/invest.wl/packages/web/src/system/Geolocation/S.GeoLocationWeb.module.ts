import { ISGeoLocationService, SGeoLocationServiceTid } from '@invest.wl/system/src/Geolocation/S.GeoLocation.types';
import { IoC, IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { SGeoLocationWebService } from './S.GeoLocationWeb.service';
import { SGeoLocationModule } from '@invest.wl/system/src/Geolocation/S.GeoLocation.module';

export class SGeoLocationWebModule extends IocModule {
  private _module = new SGeoLocationModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISGeoLocationService>(SGeoLocationServiceTid).to(SGeoLocationWebService).inSingletonScope();
    this._module.configure(ioc);
  }

  public init() {
    const service = IoC.get<ISGeoLocationService>(SGeoLocationServiceTid);
    return service.init();
  }
}
