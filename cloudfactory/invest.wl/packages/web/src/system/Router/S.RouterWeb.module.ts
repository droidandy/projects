import { SRouterWebStore } from './S.RouterWeb.store';
import { SRouterWebService } from './S.RouterWeb.service';
import { IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { ISRouterService, SRouterServiceTid, SRouterStoreTid } from '@invest.wl/system/src/Router/S.Router.types';
import { SRouterModule } from '@invest.wl/system/src/Router/S.Router.module';
import { ISRouterWebStore } from './S.RouterWeb.types';

export class SRouterWebModule extends IocModule {
  private _module = new SRouterModule();

  public configure(ioc: IocContainer): void {
    ioc.bind<ISRouterWebStore>(SRouterStoreTid).to(SRouterWebStore).inSingletonScope();
    ioc.bind<ISRouterService>(SRouterServiceTid).to(SRouterWebService).inSingletonScope();
    this._module.configure(ioc);
  }

  public async init() {
    return this._module.init();
  }
}
