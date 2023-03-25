import { IocContainer, IocModule } from '@invest.wl/core';
import { SErrorListenerTid, SErrorModule } from '@invest.wl/system';
import { SErrorMobileListener } from './S.ErrorMobile.listener';

export class SErrorMobileModule extends IocModule {
  private _module = new SErrorModule();

  public configure(ioc: IocContainer): void {
    this._module.configure(ioc);
    ioc.bind<SErrorMobileListener>(SErrorListenerTid).to(SErrorMobileListener).inSingletonScope();
  }

  public init(): Promise<any> {
    return this._module.init();
  }
}
