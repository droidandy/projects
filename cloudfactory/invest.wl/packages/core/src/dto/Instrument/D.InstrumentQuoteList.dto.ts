import { IDSortResult } from '../../types';
import { EDTradeDirection, IDTradeSettle } from '../Trade';
import { EDInstrumentQuoteType, IDInstrumentDTO, IDInstrumentSummaryPart } from './D.Instrument.dto';

export type IDInstrumentQuoteListSort = Partial<Pick<IDInstrumentQuoteItemDTO, 'Change' | 'Volume' | 'Name' | 'MidRate'>>;

export interface IDInstrumentQuoteListRequestDTO {
  type: EDInstrumentQuoteType;
  offset?: number;
  pageSize?: number;
  showParams?: boolean;
  order?: IDSortResult<IDInstrumentQuoteListSort>;
}

export interface IDInstrumentQuoteListResponseDTO extends Array<IDInstrumentQuoteItemDTO> {
}

export interface IDInstrumentQuoteItemDTO extends IDInstrumentDTO, IDInstrumentSummaryPart {
  Ask: number;
  Bid: number;

  // unique field //
  HasOrder: boolean;
  HasAlert: boolean;
  HasIdea: boolean;
  DaysToMaturity?: number;
  Type: EDInstrumentQuoteType;
  Time: Date;

  Order: IDInstrumentQuoteOrderSummaryDTO;
  Alert: IDInstrumentQuoteAlertSummaryDTO;
  SettleCode?: IDTradeSettle;
  // TODO: enum
  Perpetual: number;
}

export interface IDInstrumentQuoteOrderSummaryDTO {
  // Количество активных открытых заявок
  Count: number;
  // Цена ближайшей выставленной активной заявки
  Price: number;
  // Направление ближайшей выставленной активной заявки
  BS: EDTradeDirection;
}

export interface IDInstrumentQuoteAlertSummaryDTO {
  // Количество алертов (InstrumentAlert)
  Count: number;
  // Ближайшая цена алерта
  TargetPrice: number;
  // Сколько осталось до ближайшего алерта
  PointToTargetPrice: number;
}
