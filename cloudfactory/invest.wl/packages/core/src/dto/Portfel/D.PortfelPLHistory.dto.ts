import { TModelId } from '../../types';
import { TDCurrencyCode } from '../Currency/D.Currency.dto';
import { EDPortfelHistoryType } from './D.Portfel.dto';

export interface IDPortfelPLHistoryRequestDTO {
  // Date ISO string
  dateFrom: string;
  // Date ISO string
  dateTo: string;
  currencyName: TDCurrencyCode;
  accountIdList?: TModelId[];
  type?: EDPortfelHistoryType;
}

export interface IDPortfelPLHistoryResponseDTO extends Array<IDPortfelPLHistoryItemDTO> {

}

export interface IDPortfelPLHistoryItemDTO {
  // id = index
  id: TModelId;
  Date: Date;
  PL: number;
  // marketValue: number;
  Agreement: TModelId;
}
