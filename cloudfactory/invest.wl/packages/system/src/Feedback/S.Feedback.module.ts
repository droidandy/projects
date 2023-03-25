import { IocContainer, IocModule } from '@invest.wl/core';

export class SFeedbackModule extends IocModule {
  public configure(ioc: IocContainer): void {
    // ioc.bind<I>(Tid).to(S).inSingletonScope();
  }

  public init() {
    return Promise.resolve();
  }
}
