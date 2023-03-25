import { IocContainer, IocModule } from '@invest.wl/core';
import { VCurrencyI18n } from './V.Currency.i18n';
import { IVCurrencyI18n, VCurrencyI18nTid } from './V.Currency.types';

export class VCurrencyModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<IVCurrencyI18n>(VCurrencyI18nTid).to(VCurrencyI18n).inSingletonScope();
  }
}
