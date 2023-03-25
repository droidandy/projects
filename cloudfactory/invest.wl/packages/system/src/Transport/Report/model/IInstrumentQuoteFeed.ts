import { EDInstrumentAssetSubType, EDInstrumentAssetType, EDInstrumentQuoteType, EDInstrumentTradeState } from '@invest.wl/core';

export interface IInstrumentQuoteFeedRequest {
  type: EDInstrumentQuoteType;
  offset?: number;
  pageSize?: number;
  order?: string;
  showParams?: boolean;
}

export interface IInstrumentQuoteFeedResponse extends Array<IInstrumentQuoteFeedResponseItem> {
}

export interface IInstrumentQuoteFeedResponseItem {
  InstrumentId: number;
  Name: string;
  Currency: { Name: string };
  MidRate: number;
  Change: number;
  ChangePoint: number;
  HasPosition: boolean;
  IsFavorite: boolean;
  Type: EDInstrumentQuoteType;
  Time: Date;
  State: EDInstrumentTradeState;
  HasIdea: boolean;
  PriceStep: number;
  Bid: number;
  Ask: number;
  HighPrice: number;
  LowPrice: number;
  Volume: number;
  AssetType: EDInstrumentAssetType;
  AssetSubType: EDInstrumentAssetSubType;
  HasOrder: boolean;
  HasAlert: boolean;
  MidRateMoney: number;
  YTM: number;
  HighPriceMoney: number;
  LowPriceMoney: number;
  Order: { Count: number; Price: number; BS: 'B' | 'S' };
  Alert: { Count: number; TargetPrice: number; PointToTargetPrice: number };
  Image: { Default: string };
  ClassCode: string;
  SecurCode: string;
  DaysToMaturity?: number;
  MaturityDate?: Date;
  Perpetual: number;
}
