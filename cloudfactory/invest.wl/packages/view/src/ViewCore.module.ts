import { IIocModule, IocModule } from '@invest.wl/core';
import { VAccountModule } from './Account/V.Account.module';
import { VApplicationModule } from './Application/V.Application.module';
import { VAuthModule } from './Auth/V.Auth.module';
import { VCurrencyModule } from './Currency/V.Currency.module';
import { VCustomerModule } from './Customer/V.Customer.module';
import { VDateModule } from './Date/V.Date.module';
import { VFeedbackModule } from './Feedback/V.Feedback.module';
import { VInstrumentModule } from './Instrument/V.Instrument.module';
import { VInstrumentAlertModule } from './InstrumentAlert/V.InstrumentAlert.module';
import { VInvestIdeaModule } from './InvestIdea/V.InvestIdea.module';
import { VNewsModule } from './News/V.News.module';
import { VNotificationModule } from './Notification/V.Notification.module';
import { VOperationModule } from './Operation/V.Operation.module';
import { VOrderModule } from './Order/V.Order.module';
import { VOwnerModule } from './Owner/V.Owner.module';
import { VPortfelModule } from './Portfel/V.Portfel.module';
import { VStoryModule } from './Story/V.Story.module';
import { VThemeModule } from './Theme/V.Theme.module';
import { VTradeModule } from './Trade/V.Trade.module';

export class ViewCoreModule extends IocModule {
  protected list: IIocModule[] = [
    new VApplicationModule(),
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
    new VFeedbackModule(),
    new VDateModule(),
  ];
}
