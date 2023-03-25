import { IIocModule, IocModule } from '@invest.wl/core';
import { VApplicationModule, VCurrencyModule, VCustomerModule, VDateModule, VOwnerModule, VRouterModule } from '@invest.wl/view';
import { VAccountModule } from '../../view/src/Account/V.Account.module';
import { VAuthModule } from '../../view/src/Auth/V.Auth.module';
import { VInstrumentModule } from '../../view/src/Instrument/V.Instrument.module';
import { VInstrumentAlertModule } from '../../view/src/InstrumentAlert/V.InstrumentAlert.module';
import { VInvestIdeaModule } from '../../view/src/InvestIdea/V.InvestIdea.module';
import { VNewsModule } from '../../view/src/News/V.News.module';
import { VNotificationModule } from '../../view/src/Notification/V.Notification.module';
import { VOperationModule } from '../../view/src/Operation/V.Operation.module';
import { VOrderModule } from '../../view/src/Order/V.Order.module';
import { VPortfelModule } from '../../view/src/Portfel/V.Portfel.module';
import { VSecurityModule } from '../../view/src/Security/V.Security.module';
import { VStoryModule } from '../../view/src/Story/V.Story.module';
import { VThemeModule } from '../../view/src/Theme/V.Theme.module';
import { VTradeModule } from '../../view/src/Trade/V.Trade.module';
import { VSharedModule } from './view/kit/V.Shared.module';

export class ViewCoreMobileModule extends IocModule {
  protected list: IIocModule[] = [
    new VRouterModule(),
    new VSecurityModule(),
    new VDateModule(),
    new VCurrencyModule(),

    new VThemeModule(),
    new VAuthModule(),
    new VAccountModule(),
    new VInstrumentModule(),
    new VInstrumentAlertModule(),
    new VInvestIdeaModule(),
    new VNewsModule(),
    new VStoryModule(),
    new VOwnerModule(),
    new VNotificationModule(),
    new VOperationModule(),
    new VPortfelModule(),
    new VOrderModule(),
    new VTradeModule(),
    new VCustomerModule(),
    new VApplicationModule(),

    new VSharedModule(),
  ];
}
