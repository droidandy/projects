import { TModelId } from '../../types';
import { TDCurrencyCode } from '../Currency';

export interface IDOperationWithdrawCreateDTO {
  agreementFrom: TModelId;
  accountFrom: TModelId;
  // TODO: сделать DInputModelObject
  // bankTo: IDBankAccountEditDTO;
  currency: TDCurrencyCode;
  total: number;
}
