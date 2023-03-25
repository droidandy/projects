import { EDTradeDirection, EDTradeMarket } from '@invest.wl/core';
import { IVTradeListPresentProps } from './present/V.TradeList.present';

export const VTradeI18nTid = Symbol.for('VTradeI18nTid');

export enum EVTradeScreen {
  TradeList = 'TradeList',
}

export interface IVTradeScreenParams {
  TradeList: IVTradeListPresentProps;
}

export interface IVTradeI18n {
  readonly direction: { [D in EDTradeDirection]: string };
  readonly directionAction: { [D in EDTradeDirection]: string };
  readonly market: { [D in EDTradeMarket]: string };
}
