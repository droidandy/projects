import {
  EDInstrumentAlertStatus,
  EDInstrumentAssetSubType,
  EDInstrumentAssetType,
  EDInstrumentTradeState,
  EDPortfelTradingState,
  IDCurrencyDTO,
  TDurationISO8601,
} from '@invest.wl/core';

export interface IGetAlertRequest {
  status?: number;
  instrumentId?: number;
  pageSize?: number;
  offset?: number;
  secureCode?: string;
  classCode?: string;
}

export interface IGetAlertResponse extends Array<IGetAlertResponseItem> { }

export interface IGetAlertResponseItem {
  AlertId: number;
  Instrument: Instrument;
  Currency: IDCurrencyDTO;
  Date: Date;
  TargetPrice: number;
  ExerciseDate: Date;
  PriceStep: number;
  PointToTargetPrice: number;
  PercentToTargetPrice: number;
  PercentFromStartPrice: number;
  StartPrice: number;
  Status: EDInstrumentAlertStatus;
}

interface Instrument {
  InstrumentId: number;
  ClassCode: string;
  SecureCode: string;
  Name: string;
  CanOrder: EDPortfelTradingState;
  LastPrice: number;
  AssetType: EDInstrumentAssetType;
  AssetSubType: EDInstrumentAssetSubType;
  State: EDInstrumentTradeState;
  TimeToOpenTradeSession: TDurationISO8601;
  IsFavorite: boolean;
  Image: { Default: string };
}
