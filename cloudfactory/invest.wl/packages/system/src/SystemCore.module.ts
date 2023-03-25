import { IIocModule, IocContainer, IocModule } from '@invest.wl/core';
import { SApplicationModule } from './Application/S.Application.module';
import { SAuthModule } from './Auth/S.Auth.module';
import { SConfigModule } from './Config/S.Config.module';
import { SErrorModule } from './Error/S.Error.module';
import { SLoggerModule } from './Logger/S.Logger.module';
import { SNetworkModule } from './Network/S.Network.module';
import { SNotificationModule } from './Notification/S.Notification.module';
import { SSecurityModule } from './Security/S.Security.module';
import { SStorageLocalModule } from './StorageLocal/S.StorageLocal.module';
import { STransportModule } from './Transport/S.Transport.module';

export class SystemCoreModule extends IocModule {
  protected list: IIocModule[] = [
    // order important! don't move down this modules
    new SConfigModule(),
    new SApplicationModule(),
    new SSecurityModule(),
    new SStorageLocalModule(),

    // other modules
    new SErrorModule(),
    new SNetworkModule(),
    new STransportModule(),
    new SLoggerModule(),
    new SNotificationModule(),
    new SAuthModule(),
  ];

  public configure(ioc: IocContainer): void {
    this.list.forEach(m => m.configure(ioc));
  }

  public init() {
    return Promise.all(this.list.map(m => m.init?.()));
  }
}
