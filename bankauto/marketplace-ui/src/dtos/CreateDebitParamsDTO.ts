import { DebitCardName } from 'store/types';
import { LeadSourceInfo } from 'types/LeadSourceInfo';

export interface CreateDebitParamsDTO {
  phone: string;
  name: string;
  debitCardData?: {
    budget?: boolean;
    cashback?: boolean;
    debitCardName?: DebitCardName;
    mastercard?: boolean;
    mir?: boolean;
    savings?: boolean;
    travel?: boolean;
  };
  meta?: Partial<LeadSourceInfo>;
}
