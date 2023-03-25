import { IoC, IocContainer, IocModule } from '@invest.wl/core';
import { SNotificationListener } from './S.Notification.listener';
import { SNotificationStore } from './S.Notification.store';
import { ISNotificationStore, SNotificationListenerTid, SNotificationStoreTid } from './S.Notification.types';

export class SNotificationModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<ISNotificationStore>(SNotificationStoreTid).to(SNotificationStore).inSingletonScope();
    ioc.bind<SNotificationListener>(SNotificationListenerTid).to(SNotificationListener).inSingletonScope();
  }

  public async init() {
    const store = IoC.get<ISNotificationStore>(SNotificationStoreTid);
    const listener = IoC.get<SNotificationListener>(SNotificationListenerTid);
    store.init();
    listener.init();
  }
}
