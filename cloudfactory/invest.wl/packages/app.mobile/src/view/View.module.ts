import { IIocModule, IocContainer, IocModule } from '@invest.wl/core';
import { ViewCoreMobileModule } from '@invest.wl/mobile';
import { IVIconConfig, VIconConfigTid } from '@invest.wl/view/src/Icon/V.Icon.types';
import { IVOwnerConfig, VOwnerConfigTid } from '@invest.wl/view/src/Owner/V.Owner.types';
import { VSecurityI18n } from '@invest.wl/view/src/Security/V.Security.i18n';
import { IVSecurityI18n, VSecurityI18nTid } from '@invest.wl/view/src/Security/V.Security.types';
import { IVThemeAdapter, VThemeAdapterTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VIconConfig } from './Icon/V.Icon.config';
import { VLayoutModule } from './Layout/V.Layout.module';
import { VOwnerConfig } from './Owner/V.Owner.config';
import { VThemeAdapter } from './Theme/V.Theme.adapter';

export class ViewModule extends IocModule {
  protected list: IIocModule[] = [
    new ViewCoreMobileModule(),
    new VLayoutModule(),
  ];

  public configure(ioc: IocContainer): void {
    ioc.bind<IVThemeAdapter>(VThemeAdapterTid).to(VThemeAdapter).inSingletonScope();
    ioc.bind<IVSecurityI18n>(VSecurityI18nTid).to(VSecurityI18n).inSingletonScope();
    ioc.bind<IVOwnerConfig>(VOwnerConfigTid).to(VOwnerConfig).inSingletonScope();
    ioc.bind<IVIconConfig>(VIconConfigTid).to(VIconConfig).inSingletonScope();

    super.configure(ioc);
  }
}
