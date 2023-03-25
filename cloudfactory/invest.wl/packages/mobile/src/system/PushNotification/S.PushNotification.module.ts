import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { SPushNotificationListener } from './S.PushNotification.listener';
import { SPushNotificationStore } from './S.PushNotification.store';
import { ISPushNotificationListener, ISPushNotificationStore, SPushNotificationListenerTid, SPushNotificationStoreTid } from './S.PushNotification.types';

export class SPushNotificationModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<ISPushNotificationStore>(SPushNotificationStoreTid).to(SPushNotificationStore).inSingletonScope();
    ioc.bind<ISPushNotificationListener>(SPushNotificationListenerTid).to(SPushNotificationListener).inSingletonScope();
  }

  public init() {
    const _store = IoC.get<SPushNotificationStore>(SPushNotificationStoreTid);
    const _listener = IoC.get<ISPushNotificationListener>(SPushNotificationListenerTid);
    return Promise.all([_store.init(), _listener.init()]);
  }
}
