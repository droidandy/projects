import { CreditSubtype } from '@marketplace/ui-kit/types';
import { LeadSourceInfo } from '../types/LeadSourceInfo';

export interface CreateCreditApplicationParamsDTO {
  application_uuid?: string;
  vehicle_id: number;
  sales_office_id: number;
  initial_payment: number;
  amount: number;
  term: number;
  discount?: number;
  rate: number;
  monthly_payment: number;
  vehicle_cost: number;
  subtype: CreditSubtype;
  source?: string;
  utm?: Partial<LeadSourceInfo>;
}
