import { EDInstrumentAssetSubType, EDInstrumentAssetType } from '@invest.wl/core';

export interface IDataInstrumentRequest {
  instrumentId: number;
  ticker?: string;
  classcode?: string;
}

export interface IDataInstrumentResponse {
  InstrumentId: number;
  Name: string;
  SecurCode: string;
  MidRate?: number;
  Bid: number;
  Ask: number;
  Currency: { Name: string };
  Updated: string;
  PriceStep: number;
  LotSize: number;
  Change?: number;
  ChangePoint?: number;
  Notional: number;
  Factor: number;
  Amount: number;
  IsFavorite: boolean;
  AssetType: {
    AssetTypeId: EDInstrumentAssetType;
    Name: string;
  };
  AssetSubType: {
    AssetSubTypeId: EDInstrumentAssetSubType;
    Name: string;
  };
  YTM: number;
  DaysToMaturityOrPut: number;
  AI: number;
  PLToMaturity: number;
  Strike: number;
  ExpiryDate: Date;
  TradeFloorId: number;
  Issuer: string;
  InstrumentKind: string;
  Exchange: string;
  PricingCurrency?: string;
  DealingCurrency?: string;
  CanMarketOrder: boolean;
  InitialMargin: number;
  ClassCode: string;
  MidRateMoney?: number;
  BidMoney?: number;
  AskMoney?: number;
  Image?: {
    Default: string;
  };
  MinPiece: number;
}
