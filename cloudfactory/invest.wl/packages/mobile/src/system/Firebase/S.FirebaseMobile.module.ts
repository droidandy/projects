import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { ISFirebaseStore, SFirebaseModule, SFirebaseStoreTid } from '@invest.wl/system';
import { SFirebaseMobileStore } from './S.FirebaseMobile.store';

export class SFirebaseMobileModule extends IocModule {
  private _module = new SFirebaseModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISFirebaseStore>(SFirebaseStoreTid).to(SFirebaseMobileStore).inSingletonScope();
    this._module.configure(ioc);
  }

  public async init() {
    const store = IoC.get<ISFirebaseStore>(SFirebaseStoreTid);
    return store.init();
  }
}
