import { IoC, IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DOrderCancelCase, DOrderCancelCaseTid } from './case/D.OrderCancel.case';
import { DOrderCreateCase, DOrderCreateCaseTid } from './case/D.OrderCreate.case';
import { DOrderCreateCanCase, DOrderCreateCanCaseTid } from './case/D.OrderCreateСan.case';
import { DOrderListCase, DOrderListCaseTid } from './case/D.OrderList.case';
import { DOrderConfig, DOrderConfigTid } from './D.Order.config';
import { DOrderGateway, DOrderGatewayTid } from './D.Order.gateway';
import { DOrderCreateConfirmStrategyTid, EDOrderConfirmStrategy, IDOrderCreateConfirmStrategy } from './D.Order.types';
import { DOrderCreateModel, DOrderCreateModelTid, IDOrderCreateModel } from './model/D.OrderCreate.model';
import { DOrderCreateConfirmModel, DOrderCreateConfirmModelTid, IDOrderCreateConfirmModel } from './model/D.OrderCreateConfirm.model';
import { DOrderInfoModel, DOrderInfoModelTid, IDOrderInfoModel } from './model/D.OrderInfo.model';
import { DOrderItemModel, DOrderItemModelTid, IDOrderItemModel } from './model/D.OrderItem.model';
import { DOrderCreateConfirmSecurityStrategy } from './strategy/D.OrderCreateConfirmSecurity.strategy';
import { DOrderCreateConfirmSimpleStrategy } from './strategy/D.OrderCreateConfirmSimple.strategy';
import { DOrderCreateConfirmSMSStrategy } from './strategy/D.OrderCreateConfirmSMS.strategy';

export class DOrderModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DOrderConfig>(DOrderConfigTid).to(DOrderConfig).inSingletonScope();
    ioc.bind<DOrderGateway>(DOrderGatewayTid).to(DOrderGateway).inSingletonScope();

    const cfg = IoC.get<DOrderConfig>(DOrderConfigTid);
    ioc.bind<IDOrderCreateConfirmStrategy>(DOrderCreateConfirmStrategyTid).to(
      cfg.confirmStrategy === EDOrderConfirmStrategy.Security
        ? DOrderCreateConfirmSecurityStrategy : cfg.confirmStrategy === EDOrderConfirmStrategy.SMS
          ? DOrderCreateConfirmSMSStrategy : DOrderCreateConfirmSimpleStrategy).inSingletonScope();
    ioc.bind<DOrderListCase>(DOrderListCaseTid).to(DOrderListCase);
    ioc.bind<DOrderCancelCase>(DOrderCancelCaseTid).to(DOrderCancelCase);
    ioc.bind<DOrderCreateCase>(DOrderCreateCaseTid).to(DOrderCreateCase);
    ioc.bind<DOrderCreateCanCase>(DOrderCreateCanCaseTid).to(DOrderCreateCanCase);
    ioc.bind<NewableType<IDOrderItemModel>>(DOrderItemModelTid).toConstructor<IDOrderItemModel>(DOrderItemModel);
    ioc.bind<NewableType<IDOrderInfoModel>>(DOrderInfoModelTid).toConstructor<IDOrderInfoModel>(DOrderInfoModel);
    ioc.bind<NewableType<IDOrderCreateModel>>(DOrderCreateModelTid).toConstructor<IDOrderCreateModel>(DOrderCreateModel);
    ioc.bind<NewableType<IDOrderCreateConfirmModel>>(DOrderCreateConfirmModelTid).toConstructor<IDOrderCreateConfirmModel>(DOrderCreateConfirmModel);
  }

  public async init() {
    const _const = IoC.get<DOrderConfig>(DOrderConfigTid);
    await _const.init();
  }
}
