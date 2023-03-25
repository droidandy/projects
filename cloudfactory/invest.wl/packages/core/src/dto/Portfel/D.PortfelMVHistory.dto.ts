import { TModelId } from '../../types';
import { TDCurrencyCode } from '../Currency/D.Currency.dto';
import { EDPortfelHistoryType } from './D.Portfel.dto';

export interface IDPortfelMVHistoryRequestDTO {
  // Date ISO string
  dateFrom: string;
  // Date ISO string
  dateTo: string;
  currencyName: TDCurrencyCode;
  accountIdList?: TModelId[];
  type?: EDPortfelHistoryType;
}

export interface IDPortfelMVHistoryResponseDTO extends Array<IDPortfelMVHistoryItemDTO> {

}

export interface IDPortfelMVHistoryItemDTO {
  // id = index
  id: TModelId;
  Date: Date;
  // PL: number;
  MarketValue: number;
  Agreement: TModelId;
}
