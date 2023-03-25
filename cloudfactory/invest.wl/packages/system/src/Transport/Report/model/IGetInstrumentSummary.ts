import {
  EDInstrumentAssetSubType,
  EDInstrumentAssetType,
  EDInstrumentTradeState,
  EDPortfelTradingState,
  IDCurrencyDTO,
  TDurationISO8601,
} from '@invest.wl/core';

export interface IGetInstrumentSummaryRequest {
  instrumentId: number;
  classcode?: string;
  securcode?: string;
}

export interface IGetInstrumentSummaryResponse {
  Instrument: SummaryInstrument;
  Position: Position;
  NextTradeDate: Date;
}

export interface SummaryInstrument {
  InstrumentId: number;
  Name: string;
  MidRate: number;
  ClassCode: string;
  SecurCode: string;
  Exchange: string;
  Currency: IDCurrencyDTO;
  ChangePoint: number;
  Change: number;
  Updated: Date;
  OpenPrice: number;
  OpenPricePercent: number;
  HighPrice: number;
  LowPrice: number;
  Volume: number;
  MarketCap: number;
  PriceProfit: number;
  AvgVolume: number;
  State: EDInstrumentTradeState;
  Bid: number;
  Ask: number;
  FilterGroupId: number;
  CanOrder: EDPortfelTradingState;
  IsFavorite: boolean;
  HasPosition: boolean;
  Resistance: string;
  Support: string;
  TechAnalysis: string;
  AssetType: EDInstrumentAssetType;
  AssetSubType: EDInstrumentAssetSubType;
  AssetTypeDescription: string;
  YTM: number;
  DaysToMaturityOrPut: number;
  AI: number;
  PLToMaturity: number;
  PriceStep: number;
  ShortDescription: string;
  FullDescription: string;
  LotSize: number;
  TargetPrice: number;
  PointToTargetPrice: number;
  TimeToOpenTradeSession: TDurationISO8601;
  PricingCurrency: string;
  DealingCurrency: string;
  InitialMargin: number;
  MidRateMoney: number;
  HighPriceMoney: number;
  LowPriceMoney: number;
  Image: { Default: string };
  BidMoney: number;
  AskMoney: number;
  PriceMin: number;
  PriceMax: number;
  ClosePrice: number;
  ClosePricePercent: number;
  Notional: number;
  MaturityDate: Date;
  NextCouponDate: Date;
  CouponValue: number;
  OfferDate: Date;
  CouponRate: number;
  Perpetual: number;
}

interface Position {
  Amount: number;
  Share: number;
  MarketValue: number;
  AvgCostPrice: number;
  Revaluation: number;
  RevaluationP: number;
  AvgCostPriceMoney: number;
}
