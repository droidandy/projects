import { TModelId } from '../../types';
import { IDInstrumentDTO } from './D.Instrument.dto';

export interface IDInstrumentSearchRequestDTO {
  // Name / SecureCode / ClassCode
  text: string;
}

export interface IDInstrumentSearchResponseDTO extends Array<IDInstrumentSearchItemDTO> {
}

export interface IDInstrumentSearchItemDTO extends IDInstrumentDTO {
  Updated: Date;
  MaturityDate?: Date;
  TradeFloorId: TModelId;
  // TODO: ask
  // SettleCode?: IDTradeSettle;
  // TODO: enum
  Perpetual: number;
}
