import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVOrderCreateModel, VOrderCreateModel, VOrderCreateModelTid } from './model/V.OrderCreate.model';
import { IVOrderCreateConfirmModel, VOrderCreateConfirmModel, VOrderCreateConfirmModelTid } from './model/V.OrderCreateConfirm.model';
import { IVOrderInfoModel, VOrderInfoModel, VOrderInfoModelTid } from './model/V.OrderInfo.model';
import { IVOrderItemModel, VOrderItemModel, VOrderItemModelTid } from './model/V.OrderItem.model';
import { VOrderCreatePresent, VOrderCreatePresentTid } from './present/V.OrderCreate.present';
import { VOrderCreateCanPresent, VOrderCreateCanPresentTid } from './present/V.OrderCreateCan.present';
import { VOrderListPresent, VOrderListPresentTid } from './present/V.OrderList.present';
import { VOrderI18n } from './V.Order.i18n';
import { IVOrderI18n, VOrderI18nTid } from './V.Order.types';

export class VOrderModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<IVOrderI18n>(VOrderI18nTid).to(VOrderI18n).inSingletonScope();
    ioc.bind<VOrderListPresent>(VOrderListPresentTid).to(VOrderListPresent);
    ioc.bind<VOrderCreatePresent>(VOrderCreatePresentTid).to(VOrderCreatePresent);
    ioc.bind<VOrderCreateCanPresent>(VOrderCreateCanPresentTid).to(VOrderCreateCanPresent);
    ioc.bind<NewableType<IVOrderItemModel>>(VOrderItemModelTid).toConstructor<IVOrderItemModel>(VOrderItemModel);
    ioc.bind<NewableType<IVOrderInfoModel>>(VOrderInfoModelTid).toConstructor<IVOrderInfoModel>(VOrderInfoModel);
    ioc.bind<NewableType<IVOrderCreateModel>>(VOrderCreateModelTid).toConstructor<IVOrderCreateModel>(VOrderCreateModel);
    ioc.bind<NewableType<IVOrderCreateConfirmModel>>(VOrderCreateConfirmModelTid).toConstructor<IVOrderCreateConfirmModel>(VOrderCreateConfirmModel);
  }
}
