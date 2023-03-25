import { EDInstrumentTradeState, EDInvestIdeaInstrumentType, EDInvestIdeaType, IDCurrencyDTO, TDurationISO8601 } from '@invest.wl/core';

export interface IGetInvestIdeaListRequest {
  type?: EDInvestIdeaInstrumentType;
  instrumentId?: number;
  investIdeaId?: number;
  currencies?: string;
  order?: string;
  offset?: number;
  pagesize?: number;
}

export interface IGetInvestIdeaListResponse extends Array<IGetInvestIdeaListResponseItem> { }

export interface IGetInvestIdeaListResponseItem {
  InvestIdeaId: number;
  Instrument: Instrument;
  Title: string;
  Profit?: number;
  PriceOpen?: number;
  PriceClose?: number;
  Horizon: TDurationISO8601;
  DateOpen?: Date;
  DateCreate?: Date;
  Image: InvestIdeaListImage;
  IsFavorite?: boolean;
  DateClose?: Date;
  RealizeProfit?: number;
  Strategy: string;
  Status: number;
  IdeaType: EDInvestIdeaType;
  Placement: IInvestIdeaPlacement;
  Views: number;
}

interface Instrument {
  InstrumentId: number;
  Name: string;
  MidRate?: number;
  Change?: number;
  ChangePoint?: number;
  Currency: IDCurrencyDTO;
  ClassCode: string;
  SecurCode: string;
  CanOrder?: number;
  Image: { Default: string };
  AssetType?: number;
  AssetSubType?: number;
  PriceStep?: number;
  State: EDInstrumentTradeState;
  TimeToOpenTradeSession: TDurationISO8601;
  MidRatePercent?: number;
  CouponRate?: number;
}

interface InvestIdeaListImage {
  Small: string;
  Medium: string;
  Big: string;
}

interface IInvestIdeaPlacement {
  PlacementId: number;
  DateStart?: Date;
  DateEnd?: Date;
  Yield?: number;
  Description: string;
}
