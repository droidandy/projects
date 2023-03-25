import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { DTradeListCase, DTradeListCaseTid } from './case/D.TradeList.case';
import { DTradeGateway, DTradeGatewayTid } from './D.Trade.gateway';
import { DTradeModel, DTradeModelTid, IDTradeModel } from './model/D.Trade.model';

export class DTradeModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<DTradeGateway>(DTradeGatewayTid).to(DTradeGateway).inSingletonScope();
    ioc.bind<DTradeListCase>(DTradeListCaseTid).to(DTradeListCase);
    ioc.bind<NewableType<IDTradeModel>>(DTradeModelTid).toConstructor<IDTradeModel>(DTradeModel);
  }
}
