import { IocContainer, IocModule } from '@invest.wl/core';
import { ISKeyboardStore, SKeyboardModule, SKeyboardStoreTid } from '@invest.wl/system';
import { SKeyboardMobileStore } from './S.KeyboardMobile.store';

export class SKeyboardMobileModule extends IocModule {
  private _module = new SKeyboardModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISKeyboardStore>(SKeyboardStoreTid).to(SKeyboardMobileStore).inSingletonScope();
    this._module.configure(ioc);
  }

  public async init() {
    return this._module.init();
  }
}
