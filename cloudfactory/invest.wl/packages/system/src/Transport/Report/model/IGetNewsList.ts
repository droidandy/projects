import { EDInstrumentTradeState, EDNewsRubrick, EDNewsStatus, IDCurrencyDTO, IDImageSized, TDurationISO8601 } from '@invest.wl/core';

export interface IGetNewsListRequest {
  newsId?: number;
  instrumentId?: number;
  pageSize?: number;
  offset?: number;
  suggestId?: number;
}

export interface IGetNewsListResponse extends Array<IGetNewsListResponseItem> {
}

export interface IGetNewsListResponseItem {
  NewsId: number;
  Instrument: Instrument;
  Title: string;
  Body: string;
  PDF: string;
  Rubric: EDNewsRubrick;
  Link: string;
  // TODO: ask image of Instrument or News?
  Image: IDImageSized;
  Status?: EDNewsStatus;
  SourceName: string;
  Date: Date;
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
