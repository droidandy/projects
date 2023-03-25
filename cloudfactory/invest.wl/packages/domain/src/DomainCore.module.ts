import { IIocModule, IocModule } from '@invest.wl/core';
import { DAccountModule } from './Account/D.Account.module';
import { DApplicationModule } from './Application/D.Application.module';
import { DAuthModule } from './Auth/D.Auth.module';
import { DCurrencyModule } from './Currency/D.Currency.module';
import { DCustomerModule } from './Customer/D.Customer.module';
import { DDateModule } from './Date/D.Date.module';
import { DErrorModule } from './Error/D.Error.module';
import { DInstrumentModule } from './Instrument/D.Instrument.module';
import { DNotificationModule } from './Notification/D.Notification.module';
import { DOperationModule } from './Operation/D.Operation.module';
import { DOrderModule } from './Order/D.Order.module';
import { DOwnerModule } from './Owner/D.Owner.module';
import { DPortfelModule } from './Portfel/D.Portfel.module';
import { DSecurityModule } from './Security/D.Security.module';
import { DStorageLocalModule } from './StorageLocal/D.StorageLocal.module';
import { DTimerModule } from './Timer/D.Timer.module';
import { DTradeModule } from './Trade/D.Trade.module';

export class DomainCoreModule extends IocModule {
  protected list: IIocModule[] = [
    new DAccountModule(),
    new DApplicationModule(),
    new DAuthModule(),
    new DDateModule(),
    new DErrorModule(),
    new DNotificationModule(),
    new DCustomerModule(),
    new DInstrumentModule(),
    new DPortfelModule(),
    new DOrderModule(),
    new DTradeModule(),
    new DOperationModule(),
    new DCurrencyModule(),
    new DTimerModule(),
    new DOwnerModule(),
    new DSecurityModule(),
    new DStorageLocalModule(),
  ];
}
