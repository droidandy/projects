import { IIocModule, IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { VLayoutModule } from './Layout/V.Layout.module';
import { IVThemeAdapter, VThemeAdapterTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeAdapter } from './Theme/V.Theme.adapter';
import { ViewCoreMobileModule } from '@invest.wl/mobile/src/ViewCoreMobile.module';
import { VOwnerConfig } from './Owner/V.Owner.config';
import { IVOwnerConfig, VOwnerConfigTid } from '@invest.wl/view/src/Owner/V.Owner.types';
import { IVSecurityI18n, VSecurityI18nTid } from '@invest.wl/view/src/Security/V.Security.types';
import { VSecurityI18n } from '@invest.wl/view/src/Security/V.Security.i18n';
import { IVIconConfig, VIconConfigTid } from '@invest.wl/view/src/Icon/V.Icon.types';
import { VIconConfig } from './Icon/V.Icon.config';

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
