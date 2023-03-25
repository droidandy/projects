import { TModelId } from '../../types';
import { TDCurrencyCode } from '../Currency/D.Currency.dto';

export interface IDPortfelYieldHistoryRequestDTO {
  // Date ISO string
  dateFrom: string;
  // Date ISO string
  dateTo: string;
  currencyName: TDCurrencyCode;
  agreementIdList: TModelId[];
  accountIdList?: TModelId[];
}

export interface IDPortfelYieldHistoryResponseDTO extends Array<IDPortfelYieldHistoryItemDTO> {
}

export interface IDPortfelYieldHistoryItemDTO {
  // id = index
  id: TModelId;
  Date: Date;
  Name: string;
  Yield: number;
}
