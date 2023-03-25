import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { SDeepLinkService, SDeepLinkServiceTid } from './S.DeepLink.service';

export class SDeepLinkModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<SDeepLinkService>(SDeepLinkServiceTid).to(SDeepLinkService).inSingletonScope();
  }

  public init() {
    const _service = IoC.get<SDeepLinkService>(SDeepLinkServiceTid);
    return Promise.all([_service.init()]);
  }
}
