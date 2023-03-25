import { LeadSourceInfo } from 'types/LeadSourceInfo';

export interface CreateDepositParamsDTO {
  phone: string;
  name: string;
  userId?: string;
  deposit: {
    amount: number;
    term: number;
    refill: boolean;
    withdrawal: boolean;
    withoutPercentWithdrawal: boolean;
  };
  meta?: Partial<LeadSourceInfo>;
}
