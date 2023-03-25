import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { ISSecurityListener, ISSecurityStore, SSecurityListenerTid, SSecurityModule, SSecurityServiceTid, SSecurityStoreTid } from '@invest.wl/system';
import { SSecurityMobileListener } from './S.SecurityMobile.listener';
import { SSecurityMobileService } from './S.SecurityMobile.service';
import { SSecurityMobileStore } from './S.SecurityMobile.store';

export class SSecurityMobileModule extends IocModule {
  private _module = new SSecurityModule();

  public configure(ioc: IocContainer): void {
    this._module.configure(ioc);
    ioc.bind<ISSecurityListener>(SSecurityListenerTid).to(SSecurityMobileListener).inSingletonScope();
    ioc.bind<SSecurityMobileService>(SSecurityServiceTid).to(SSecurityMobileService).inSingletonScope();
    ioc.rebind<ISSecurityStore>(SSecurityStoreTid).to(SSecurityMobileStore).inSingletonScope();
  }

  public async init() {
    const service = IoC.get<SSecurityMobileService>(SSecurityServiceTid);
    // сначало нужно инициализировать стор, только потом сервис, т.к. в сервисе используются данные из стора
    await this._module.init();
    return service.init();
  }
}
