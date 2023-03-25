import { IocContainer, IocModule, NewableType } from '@invest.wl/core';
import { IVTradeModel, VTradeModel, VTradeModelTid } from './model/V.Trade.model';
import { VTradeListPresent, VTradeListPresentTid } from './present/V.TradeList.present';
import { VTradeI18n } from './V.Trade.i18n';
import { IVTradeI18n, VTradeI18nTid } from './V.Trade.types';

export class VTradeModule extends IocModule {
  public configure(ioc: IocContainer): void {
    ioc.bind<IVTradeI18n>(VTradeI18nTid).to(VTradeI18n).inSingletonScope();
    ioc.bind<VTradeListPresent>(VTradeListPresentTid).to(VTradeListPresent);
    ioc.bind<NewableType<IVTradeModel>>(VTradeModelTid).toConstructor<IVTradeModel>(VTradeModel);
  }
}
