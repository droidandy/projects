import { IocContainer, IocModule } from '@invest.wl/core';
import { DCurrencyConfig, DCurrencyConfigTid } from './D.Currency.config';

export class DCurrencyModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DCurrencyConfig>(DCurrencyConfigTid).to(DCurrencyConfig).inSingletonScope();
  }
}
