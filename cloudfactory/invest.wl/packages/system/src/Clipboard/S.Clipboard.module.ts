import { IocContainer, IocModule } from '@invest.wl/core';

export class SClipboardModule extends IocModule {
  public configure(ioc: IocContainer): void {
    // ioc.bind<>(Tid).to(S).inSingletonScope();
  }

  public init() {
    return Promise.resolve();
  }
}
