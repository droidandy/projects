import { IoC, IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { SErrorModule } from '@invest.wl/system/src/Error/S.Error.module';
import { SErrorListenerTid } from '@invest.wl/system/src/Error/S.Error.types';
import { SErrorWebListener } from './S.ErrorWeb.listener';

export class SErrorWebModule extends IocModule {
  private _module = new SErrorModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<SErrorWebListener>(SErrorListenerTid).to(SErrorWebListener).inSingletonScope();
    this._module.configure(ioc);
  }

  public init(): Promise<any> {
    const listener = IoC.get<SErrorWebListener>(SErrorListenerTid);
    return Promise.all([this._module.init(), listener.init()]);
  }
}
