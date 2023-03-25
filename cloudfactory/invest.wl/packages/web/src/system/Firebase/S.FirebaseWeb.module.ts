import { ISFirebaseStore, SFirebaseStoreTid } from '@invest.wl/system/src/Firebase/S.Firebase.types';
import { SFirebaseWebStore } from './S.FirebaseWeb.store';
import { IoC, IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { SFirebaseModule } from '@invest.wl/system/src/Firebase/S.Firebase.module';

export class SFirebaseWebModule extends IocModule {
  private _module = new SFirebaseModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISFirebaseStore>(SFirebaseStoreTid).to(SFirebaseWebStore).inSingletonScope();
    this._module.configure(ioc);
  }

  public async init() {
    const store = IoC.get<ISFirebaseStore>(SFirebaseStoreTid);
    return store.init();
  }
}
