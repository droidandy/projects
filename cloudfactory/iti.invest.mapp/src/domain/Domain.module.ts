import { IIocModule, IocContainer, IocModule } from '@invest.wl/core/src/di/IoC';
import { DomainCoreModule } from '@invest.wl/domain/src/DomainCore.module';
import { DInstrumentAlertModule } from '@invest.wl/domain/src/InstrumentAlert/D.InstrumentAlert.module';
import { DInvestIdeaModule } from '@invest.wl/domain/src/InvestIdea/D.InvestIdea.module';
import { DNewsModule } from '@invest.wl/domain/src/News/D.News.module';
import { DStoryModule } from '@invest.wl/domain/src/Story/D.Story.module';
import { DAuthAdapter } from './Auth/D.Auth.adapter';
import { DDateAdapter } from './Date/D.Date.adapter';
import { DDateAdapterTid, IDDateAdapter } from '@invest.wl/domain/src/Date/D.Date.types';
import {
  DNotificationAdapterTid, IDNotificationAdapter,
} from '@invest.wl/domain/src/Notification/D.Notification.types';
import { DNotificationAdapter } from './Notification/D.Notification.adapter';
import { DInstrumentAdapterTid, IDInstrumentAdapter } from '@invest.wl/domain/src/Instrument/D.Instrument.types';
import { DInstrumentAdapter } from './Instrument/D.Instrument.adapter';
import {
  DInstrumentAlertAdapterTid, IDInstrumentAlertAdapter,
} from '@invest.wl/domain/src/InstrumentAlert/D.InstrumentAlert.types';
import { DInstrumentAlertAdapter } from './InstrumentAlert/D.InstrumentAlert.adapter';
import { DInvestIdeaAdapterTid, IDInvestIdeaAdapter } from '@invest.wl/domain/src/InvestIdea/D.InvestIdea.types';
import { DInvestIdeaAdapter } from './InvestIdea/D.InvestIdea.adapter';
import { DNewsAdapterTid, IDNewsAdapter } from '@invest.wl/domain/src/News/D.News.types';
import { DNewsAdapter } from './News/D.News.adapter';
import { DOperationAdapter } from './Operation/D.Operation.adapter';
import { DOperationAdapterTid, IDOperationAdapter } from '@invest.wl/domain/src/Operation/D.Operation.types';
import { DOrderAdapterTid, IDOrderAdapter } from '@invest.wl/domain/src/Order/D.Order.types';
import { DOrderAdapter } from './Order/D.Order.adapter';
import { DStoryAdapterTid, IDStoryAdapter } from '@invest.wl/domain/src/Story/D.Story.types';
import { DStoryAdapter } from './Story/D.Story.adapter';
import { DPortfelAdapter } from './Portfel/D.Portfel.adapter';
import { DPortfelAdapterTid, IDPortfelAdapter } from '@invest.wl/domain/src/Portfel/D.Portfel.types';
import { DTradeAdapterTid, IDTradeAdapter } from '@invest.wl/domain/src/Trade/D.Trade.types';
import { DTradeAdapter } from './Trade/D.Trade.adapter';
import { DCustomerAdapter } from './Customer/D.Customer.adapter';
import { DAuthAdapterTid, IDAuthAdapter } from '@invest.wl/domain/src/Auth/D.Auth.types';
import { DAccountAdapterTid, IDAccountAdapter } from '@invest.wl/domain/src/Account/D.Account.types';
import { DAccountAdapter } from './Account/D.Account.adapter';
import { DOwnerAdapterTid, IDOwnerAdapter } from '@invest.wl/domain/src/Owner/D.Owner.types';
import { DOwnerAdapter } from './Owner/D.Owner.adapter';
import { DSecurityAdapterTid, IDSecurityAdapter } from '@invest.wl/domain/src/Security/D.Security.types';
import { DSecurityAdapter } from './Security/D.Security.adapter';
import { DCustomerAdapterTid, IDCustomerAdapter } from '@invest.wl/domain/src/Customer/D.Customer.types';
import { DApplicationAdapterTid, IDApplicationAdapter } from '@invest.wl/domain/src/Application/D.Application.types';
import { DApplicationAdapter } from './Application/D.Application.adapter';

export class DomainModule extends IocModule {
  protected list: IIocModule[] = [
    new DomainCoreModule(),
    new DInstrumentAlertModule(),
    new DInvestIdeaModule(),
    new DNewsModule(),
    new DStoryModule(),
  ];

  public configure(ioc: IocContainer): void {
    // adapter first
    ioc.bind<IDAuthAdapter>(DAuthAdapterTid).to(DAuthAdapter).inSingletonScope();
    ioc.bind<IDAccountAdapter>(DAccountAdapterTid).to(DAccountAdapter).inSingletonScope();
    ioc.bind<IDInstrumentAdapter>(DInstrumentAdapterTid).to(DInstrumentAdapter).inSingletonScope();
    ioc.bind<IDPortfelAdapter>(DPortfelAdapterTid).to(DPortfelAdapter).inSingletonScope();
    ioc.bind<IDOrderAdapter>(DOrderAdapterTid).to(DOrderAdapter).inSingletonScope();
    ioc.bind<IDTradeAdapter>(DTradeAdapterTid).to(DTradeAdapter).inSingletonScope();
    ioc.bind<IDNotificationAdapter>(DNotificationAdapterTid).to(DNotificationAdapter).inSingletonScope();
    ioc.bind<IDOperationAdapter>(DOperationAdapterTid).to(DOperationAdapter).inSingletonScope();
    ioc.bind<IDCustomerAdapter>(DCustomerAdapterTid).to(DCustomerAdapter).inSingletonScope();
    ioc.bind<IDInstrumentAlertAdapter>(DInstrumentAlertAdapterTid).to(DInstrumentAlertAdapter).inSingletonScope();
    ioc.bind<IDInvestIdeaAdapter>(DInvestIdeaAdapterTid).to(DInvestIdeaAdapter).inSingletonScope();
    ioc.bind<IDNewsAdapter>(DNewsAdapterTid).to(DNewsAdapter).inSingletonScope();
    ioc.bind<IDStoryAdapter>(DStoryAdapterTid).to(DStoryAdapter).inSingletonScope();
    ioc.bind<IDDateAdapter>(DDateAdapterTid).to(DDateAdapter).inSingletonScope();
    ioc.bind<IDOwnerAdapter>(DOwnerAdapterTid).to(DOwnerAdapter).inSingletonScope();
    ioc.bind<IDSecurityAdapter>(DSecurityAdapterTid).to(DSecurityAdapter).inSingletonScope();
    ioc.bind<IDApplicationAdapter>(DApplicationAdapterTid).to(DApplicationAdapter).inSingletonScope();

    super.configure(ioc);
  }
}
