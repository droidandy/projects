import { EDOrderType, EDTradeDirection } from '@invest.wl/core';

export interface IPostOrderSaveRequestRequest {
  accountId: number;
  bs: EDTradeDirection;
  amount: number;
  price: number;
  type: EDOrderType;
  instrumentId: number;
  tradeAccountMapId?: string;
  ticker: string;
  orderId: number;
  sourceType?: number;
  sourceObjectId?: number;
  classcode: string;
  stopPrice?: number;
  timeInForce?: string;
  expiryTime?: Date;
  offsetPoint?: number;
  discretionOffset?: number;
  takeProfitPrice?: number;
}

export interface IPostOrderSaveRequestResponse {
  OrderRequestId: string;
}
