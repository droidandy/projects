import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVNotificationModel, VNotificationModel, VNotificationModelTid } from './model/V.Notification.model';
import { IVNotificationImportantModel, VNotificationImportantModel, VNotificationImportantModelTid } from './model/V.NotificationImportant.model';
import { IVNotificationSettingModel, VNotificationSettingModel, VNotificationSettingModelTid } from './model/V.NotificationSetting.model';
import { VNotificationListPresent, VNotificationListPresentTid } from './present/V.NotificationList.present';
import { VNotificationStore } from './V.Notification.store';
import { VNotificationStoreTid } from './V.Notification.types';

export class VNotificationModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<VNotificationStore>(VNotificationStoreTid).to(VNotificationStore).inSingletonScope();
    ioc.bind<VNotificationListPresent>(VNotificationListPresentTid).to(VNotificationListPresent).inSingletonScope();
    ioc.bind<NewableType<IVNotificationModel>>(VNotificationModelTid).toConstructor<IVNotificationModel>(VNotificationModel);
    ioc.bind<NewableType<IVNotificationImportantModel>>(VNotificationImportantModelTid).toConstructor<IVNotificationImportantModel>(VNotificationImportantModel);
    ioc.bind<NewableType<IVNotificationSettingModel>>(VNotificationSettingModelTid).toConstructor<IVNotificationSettingModel>(VNotificationSettingModel);
  }
}
