import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { VThemeStore } from './V.Theme.store';
import { VThemeStoreTid } from './V.Theme.types';

export class VThemeModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VThemeStore>(VThemeStoreTid).to(VThemeStore).inSingletonScope();
  }

  public init() {
    const store = IoC.get<VThemeStore>(VThemeStoreTid);
    return store.init();
  }
}
