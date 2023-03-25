import { TDurationISO8601, TModelId } from '../../types';
import { EDPortfelTradingState } from '../Portfel';
import { IDInstrumentDTO, IDInstrumentSummaryPart, IDInstrumentTradePart } from './D.Instrument.dto';

export interface IDInstrumentSummaryRequestDTO {
  // id = instrumentId
  id: TModelId;
  classCode?: string;
  secureCode?: string;
}

export interface IDInstrumentSummaryResponseDTO {
  // id = instrument.id
  id: TModelId;
  Instrument: IDInstrumentSummaryDTO;
  Position: IDInstrumentSummaryPositionDTO;
  // Время начала торгов
  NextTradeDate: Date;
}

export interface IDInstrumentSummaryDTO extends IDInstrumentDTO, IDInstrumentTradePart, IDInstrumentSummaryPart {
  OpenPrice: number;
  OpenPricePercent: number;

  MarketCap: number;
  PriceProfit: number;
  AvgVolume: number;

  FilterGroupId: number;
  CanOrder: EDPortfelTradingState;
  Resistance: string;
  Support: string;
  TechAnalysis: string;

  ShortDescription: string;
  FullDescription: string;
  TargetPrice: number;
  PointToTargetPrice: number;
  TimeToOpenTradeSession: TDurationISO8601;

  PriceMax: number;
  PriceMin: number;
  ClosePrice: number;
  ClosePricePercent: number;
  NextCouponDate: Date;
  CouponValue: number;
  OfferDate: Date;
  CouponRate: number;
  // TODO: enum
  Perpetual: number;
  SellDepo?: number;
  BuyDepo?: number;
}

export interface IDInstrumentSummaryPositionDTO {
  Amount: number;
  Share: number;
  MarketValue: number;
  AvgCostPrice: number;
  Revaluation: number;
  RevaluationP: number;
  AvgCostPriceMoney: number;
}
