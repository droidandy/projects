import { EDInstrumentAssetSubType, EDInstrumentAssetType, EDOrderStatus, EDOrderType, EDTradeDirection } from '@invest.wl/core';

export interface IDataOrderRequest {
  orderId: number;
}

export interface IDataOrderResponse {
  OrderId: number;
  HumanOrderId: number;
  ExternalId: string;
  OrderDate: Date;
  BS: EDTradeDirection;
  ExchStatus: EDOrderStatus;
  Price: number;
  Amount: number;
  AmountRest: number;
  AmountOnDelete: number;
  AmountLot: number;
  ExpirationDate: Date;
  Type: EDOrderType;
  StopPrice: number;
  OffsetPoint: number;
  DiscretionOffset: number;
  InstrumentId: number;
  AccountId: number;
  Comment: string;
  Error: string;
  Moment: Date;
  IsOpenByRule: boolean;
  Ticker: string;
  TradeAccountMapId: string;
  Payment: number;
  ClassCode: string;
  TimeInForce: string;
  TakeProfitPrice: number;
  AssetType: EDInstrumentAssetType;
  AssetSubType: EDInstrumentAssetSubType;
}
