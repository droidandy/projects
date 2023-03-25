import { FilterItem } from './FilterItem';

export interface PartnerNewFormData {
  city?: FilterItem;
  companyType: number[];
  companyName: string;
  name: string;
  email: string;
  phone: string;
  comment: string;
}
