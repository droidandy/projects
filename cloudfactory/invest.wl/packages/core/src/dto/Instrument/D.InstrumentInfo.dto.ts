import { TModelId } from '../../types';
import { IDInstrumentDTO, IDInstrumentTradePart } from './D.Instrument.dto';

export interface IDInstrumentInfoRequestDTO {
  // id = instrumentId
  id: TModelId;
  secureCode?: string;
  classCode?: string;
}

export interface IDInstrumentInfoResponseDTO extends IDInstrumentDTO, IDInstrumentTradePart {
  // Unique fields //
  Amount: number;
  Factor: number;
  // Доступна рыночная торговля
  CanMarketOrder: boolean;
  TradeFloorId: TModelId;
  // Разновидность инструмента
  InstrumentKind: string;
  // Эмитент
  Issuer: string;
  ExpiryDate: Date;
  // Фиксированная цена, по которой приобретается позиция на фьючерсные контракты при реализации опционов.
  Strike: number;

  // Гарантийное обеспечение продавца
  // InitialMarginSell?: number;
  // Минимальное количество в штуках для заявки по инструменту для сделок OTC
  // MinPiece?: number;
}
