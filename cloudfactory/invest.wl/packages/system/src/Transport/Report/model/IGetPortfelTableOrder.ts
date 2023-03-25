import { EDInstrumentAssetSubType, EDInstrumentAssetType, EDOrderType, EDPortfelTradingState, EDTradeDirection, IDCurrencyDTO } from '@invest.wl/core';

export interface IGetPortfelTableOrderRequest {
  dateFrom?: Date | string;
  dateTo?: Date | string;
  clients: number[] | string;
  currencyName: string;
  accounts?: number[] | string;
  statuses?: number[] | string;
  instrumentId?: number;
  offset?: number;
  pagesize?: number;
  orderTypes?: EDOrderType[] | string;
}

export interface IGetPortfelTableOrderResponse extends Array<IGetPortfelTableOrderResponseItem> {
}

export interface IGetPortfelTableOrderResponseItem {
  OrderId: number;
  HumanOrderId: number;
  Instrument: Instrument;
  ExternalId: string;
  Date: Date;
  BS: EDTradeDirection;
  Amount: number;
  AmountRest: number;
  Price: number;
  Status: number;
  Client: string;
  Payment: number;
  Position: number;
  Account: string;
  AccountId: number;
  Board: string;
  Type: number;
  AmountEx: number;
  StopPrice: number;
  TakeProfitPrice: number;
}

interface Instrument {
  InstrumentId: number;
  Name: string;
  CanOrder: EDPortfelTradingState;
  Currency: IDCurrencyDTO;
  PriceStep: number;
  AssetType: EDInstrumentAssetType;
  AssetSubType: EDInstrumentAssetSubType;
  DealingCurrency: string;
  PricingCurrency: string;
  Image: { Default: string };
  SecurCode: string;
  ClassCode: string;
}
