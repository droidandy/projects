import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { SOrientationStoreTid } from '@invest.wl/system';
import { SOrientationMobileStore } from './S.OrientationMobile.store';

export class SOrientationMobileModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<SOrientationMobileStore>(SOrientationStoreTid).to(SOrientationMobileStore).inSingletonScope();
  }

  public async init() {
    const _store = IoC.get<SOrientationMobileStore>(SOrientationStoreTid);
    return _store.lockToPortrait();
  }
}
