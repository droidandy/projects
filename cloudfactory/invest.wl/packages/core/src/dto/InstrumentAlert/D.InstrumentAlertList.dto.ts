import { TDurationISO8601, TModelId } from '../../types';
import { IDCurrencyDTO } from '../Currency/D.Currency.dto';
import { EDInstrumentAssetSubType, EDInstrumentAssetType, EDInstrumentTradeState, IDInstrumentIdentityPart } from '../Instrument';
import { EDPortfelTradingState } from '../Portfel';
import { EDInstrumentAlertStatus } from './D.InstrumentAlert.dto';

export interface IDInstrumentAlertListRequestDTO {
  status?: EDInstrumentAlertStatus;
  instrumentId?: TModelId;
  classCode?: string;
  secureCode?: string;
  pageSize?: number;
  offset?: number;
}

export interface IDInstrumentAlertListResponseDTO extends Array<IDInstrumentAlertItemDTO> {
}

export interface IDInstrumentAlertItemDTO {
  // id = alertId;
  id: TModelId;
  Instrument: IDInstrumentAlertInstrument;
  Date: Date;
  // для облигаций это именно MidRatePercent (%), для остальных это MidRate
  TargetPrice: number;
  // для облигаций это именно MidRatePercent (%), для остальных это MidRate
  StartPrice: number;
  ExerciseDate: Date;
  PointToTargetPrice: number;
  PercentToTargetPrice: number;
  PercentFromStartPrice: number;
  Status: EDInstrumentAlertStatus;
}

interface IDInstrumentAlertInstrument extends IDInstrumentIdentityPart {
  AssetType: EDInstrumentAssetType;
  AssetSubType: EDInstrumentAssetSubType;
  IsFavorite: boolean;
  Currency: IDCurrencyDTO;
  PriceStep: number;
  // для облигаций это именно MidRatePercent (%), для остальных это MidRate
  LastPrice: number;

  CanOrder: EDPortfelTradingState;
  State: EDInstrumentTradeState;
  TimeToOpenTradeSession: TDurationISO8601;
}
