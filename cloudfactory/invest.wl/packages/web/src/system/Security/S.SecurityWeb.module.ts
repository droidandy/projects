import { IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { SSecurityModule } from '@invest.wl/system/src/Security/S.Security.module';
import {
  ISSecurityListener, SSecurityListenerTid, SSecurityServiceTid,
} from '@invest.wl/system/src/Security/S.Security.types';
import { SSecurityWebListener } from './S.SecurityWeb.listener';
import { SSecurityWebService } from './S.SecurityWeb.service';

export class SSecurityWebModule extends IocModule {
  private _module = new SSecurityModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISSecurityListener>(SSecurityListenerTid).to(SSecurityWebListener).inSingletonScope();
    ioc.bind<SSecurityWebService>(SSecurityServiceTid).to(SSecurityWebService).inSingletonScope();

    this._module.configure(ioc);
  }

  public init() {
    return this._module.init();
  }
}
