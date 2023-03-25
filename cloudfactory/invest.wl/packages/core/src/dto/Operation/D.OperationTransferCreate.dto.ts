import { TModelId } from '../../types';
import { TDCurrencyCode } from '../Currency';

export interface IDOperationTransferCreateDTO {
  agreementFrom: TModelId;
  accountFrom: TModelId;
  agreementTo: TModelId;
  accountTo: TModelId;
  currency: TDCurrencyCode;
  total: number;
}
