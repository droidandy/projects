import { TModelId } from '../../types';
import { TDCurrencyCode } from '../Currency';

export interface IDOperationDepositCreateDTO {
  // bankFrom?: IDBankAccountEditDTO;
  // bankCardFrom?: IDBankCardDTO;
  // TODO: может быть нужен не ID а например name, поэтому стоит пересылать всю модель (DTO)
  agreement: TModelId;
  // TODO: может быть нужен не ID а например name, поэтому стоит пересылать всю модель (DTO)
  account: TModelId;
  currency: TDCurrencyCode;
  total: number;
}

export interface IDOperationDepositResponseDTO {
  id: TModelId;
  limit: number;
  overdraft: number;
  commission: number;
  link: string;
}
