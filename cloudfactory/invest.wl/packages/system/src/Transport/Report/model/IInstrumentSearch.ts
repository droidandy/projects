import { EDInstrumentAssetType } from '@invest.wl/core';

export interface IInstrumentSearchRequest {
  text: string;
}

export interface IInstrumentSearchResponse extends Array<IInstrumentSearchResponseItem> {}

export interface IInstrumentSearchResponseItem {
  InstrumentId: number;
  Name: string;
  Currency: { Name: string };
  MidRate: number;
  Change: number;
  ChangePoint: number;
  IsFavorite: boolean;
  PriceStep: number;
  AssetType: EDInstrumentAssetType;
  YTM: number;
  Image: { Default: string };
  ClassCode: string;
  SecurCode: string;
  MaturityDate?: Date;
  TradeFloorId: number;
  AssetSubType: number;
  Updated: Date;
  MidRatePercent: number;
  Perpetual: number;
}
