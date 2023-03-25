import { LeadSourceInfo } from 'types/LeadSourceInfo';

export interface CreateSavingsAccountDTO {
  name: string;
  phone: string;
  userId?: string;
  utm?: Partial<LeadSourceInfo>;
}
