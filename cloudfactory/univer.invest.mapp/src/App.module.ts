import { IIocModule, IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { IRootPresent, RootPresentTid, RootPresent } from './boot/RootComponent/Root.present';
import { AppPresent, IAppPresent, AppPresentTid } from './boot/App/App.present';
import { DomainModule } from '_domain/Domain.module';
import { SystemModule } from '_system/System.module';
import { ViewModule } from '_view/View.module';

export class AppModule extends IocModule {
  protected list: IIocModule[] = [
    new SystemModule(),
    new DomainModule(),
    new ViewModule(),
  ];

  public configure(ioc: IocContainer): void {
    ioc.bind<IRootPresent>(RootPresentTid).to(RootPresent);
    ioc.bind<IAppPresent>(AppPresentTid).to(AppPresent);

    // if (__DEV__) {
    //   // eslint-disable-next-line @typescript-eslint/no-var-requires
    //   const { DebugModule } = require('./components/Debug/Debug.module');
    //   imports.push(new DebugModule());
    // }
    super.configure(ioc);
  }
}
