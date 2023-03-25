import { EDTradeDirection, EDTradeMarket, Injectable } from '@invest.wl/core';
import { IVTradeI18n } from './V.Trade.types';

@Injectable()
export class VTradeI18n implements IVTradeI18n {
  public direction: { [D in EDTradeDirection]: string } = {
    [EDTradeDirection.Buy]: 'Покупка',
    [EDTradeDirection.Sell]: 'Продажа',
  };

  public directionAction: { [D in EDTradeDirection]: string } = {
    [EDTradeDirection.Buy]: 'Купить',
    [EDTradeDirection.Sell]: 'Продать',
  };

  public market: { [D in EDTradeMarket]: string } = {
    [EDTradeMarket.Currency]: 'Валютный',
    [EDTradeMarket.Fund]: 'Фондовый',
    [EDTradeMarket.Term]: 'Срочный',
  };
}
