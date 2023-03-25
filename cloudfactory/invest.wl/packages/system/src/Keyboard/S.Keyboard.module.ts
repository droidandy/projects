import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { ISKeyboardStore, SKeyboardStoreTid } from './S.Keyboard.types';

export class SKeyboardModule extends IocModule {
  public configure(ioc: IocContainer): void {
    // ioc.bind<ISKeyboardStore>(SKeyboardStoreTid).to().inSingletonScope();
  }

  public async init() {
    const store = IoC.get<ISKeyboardStore>(SKeyboardStoreTid);
    return store.init();
  }
}
