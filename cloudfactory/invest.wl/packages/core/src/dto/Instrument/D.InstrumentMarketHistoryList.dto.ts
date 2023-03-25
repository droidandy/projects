import { TModelId } from '../../types';
import { EDInstrumentMarketHistoryGap, EDInstrumentMarketHistoryMode } from './D.Instrument.dto';

export interface IDInstrumentMarketHistoryListRequestDTO {
  mode: EDInstrumentMarketHistoryMode;
  classCode: string;
  secureCode: string;
  gap: EDInstrumentMarketHistoryGap;
  // Date ISO string
  dateFrom?: string;
  // Date ISO string
  dateTo?: string;
  offset?: number;
  pageSize?: number;
}


export interface IDInstrumentMarketHistoryListResponseDTO {
  Results: IDInstrumentMarketHistoryItemDTO[];
}

export interface IDInstrumentMarketHistoryItemDTO {
  // id = statementId
  id: TModelId;
  Series: IDInstrumentMarketHistorySeriesDTO[];
}

interface IDInstrumentMarketHistorySeriesDTO {
  Name: string;
  Columns: string[];
  Values: [string /* Date */, number, number, number, number, number][];
}
