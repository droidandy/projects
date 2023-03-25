import { EDInstrumentAssetSubType, EDInstrumentAssetType, EDPortfelTradingState, EDTradeDirection, IDCurrencyDTO, IDImageDefault } from '@invest.wl/core';

export interface IGetPortfelTableTradeRequest {
  clients: number[] | string;
  currencyName: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  isOnlyTrade?: boolean;
  accounts?: number[] | string;
  instrumentId?: string;
  offset?: number;
  pagesize?: number;
}

export interface IGetPortfelTableTradeResponse extends Array<IGetPortfelTableTradeResponseItem> {}

export interface IGetPortfelTableTradeResponseItem {
  TradeId: number;
  HumanTradeId: number;
  Instrument: Instrument;
  ExternalId: string;
  Date: Date;
  BS: EDTradeDirection;
  Amount: number;
  Price: number;
  Payment: number;
  Status: number;
  Client: string;
  AmountRest: number;
  Position: number;
  Account: string;
  PriceMoney: number;
  Board: string;
  BrokerFee: string;
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
  Image: IDImageDefault;
  SecurCode: string;
  ClassCode: string;
}
