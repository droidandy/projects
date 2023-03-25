import { IoC, IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DNotificationListCase, DNotificationListCaseTid } from './case/D.NotificationList.case';
import { DNotificationSettingCase, DNotificationSettingCaseTid } from './case/D.NotificationSetting.case';
import { DNotificationGateway, DNotificationGatewayTid } from './D.Notification.gateway';
import { DNotificationStore } from './D.Notification.store';
import { DNotificationStoreTid, IDNotificationStore } from './D.Notification.types';
import { DNotificationModel, DNotificationModelTid, IDNotificationModel } from './model/D.Notification.model';
import { DNotificationSettingModel, DNotificationSettingModelTid, IDNotificationSettingModel } from './model/D.NotificationSetting.model';

export class DNotificationModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DNotificationGateway>(DNotificationGatewayTid).to(DNotificationGateway).inSingletonScope();
    ioc.bind<IDNotificationStore>(DNotificationStoreTid).to(DNotificationStore).inSingletonScope();
    ioc.bind<DNotificationListCase>(DNotificationListCaseTid).to(DNotificationListCase);
    ioc.bind<DNotificationSettingCase>(DNotificationSettingCaseTid).to(DNotificationSettingCase);
    ioc.bind<NewableType<IDNotificationModel>>(DNotificationModelTid).toConstructor<IDNotificationModel>(DNotificationModel);
    ioc.bind<NewableType<IDNotificationSettingModel>>(DNotificationSettingModelTid).toConstructor<IDNotificationSettingModel>(DNotificationSettingModel);
  }

  public async init() {
    const store = IoC.get<DNotificationStore>(DNotificationStoreTid);
    return store.init();
  }
}
