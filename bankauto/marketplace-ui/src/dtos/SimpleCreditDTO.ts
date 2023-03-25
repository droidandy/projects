import { SimpleCreditSubtype } from '@marketplace/ui-kit/types';
import { LeadSourceInfo } from 'types/LeadSourceInfo';

export interface CreateSimpleCreditParamsDTO {
  amount: number;
  term: number;
  subtype: SimpleCreditSubtype;
  rate: number;
  monthly_payment: number;
  vehicle_cost?: number;
  initial_payment?: number;
  utm?: Partial<LeadSourceInfo>;
}

export interface CreditInsurance {
  type: number;
  company: number;
  tariff: number;
  term: number;
  amount: number;
  index: 0;
}

export interface BasicSimpleCreditParamsDTO {
  actual_address_dadata: any;
  registration_address_accommodation_type?: number;
  registration_address_dadata: any;
  passport_series: string;
  passport_number: string;
  passport_issuer_code: string;
  passport_issued_at: string;
  passport_issuer: string;
  passport_birthday: string;
  passport_birth_place: string;
  passport_patronymic: string;
  passport_surname: string;
  passport_name: string;
  passport_gender: string;
  current_email_attribute?: string;
  current_msisdn_attributes: string;
  insurances?: CreditInsurance[];
}

export interface AdditionalSimpleCreditParamsDTO {
  full_name_changed: number;
  previous_passport: number;
  previous_surname?: string;
  previous_name?: string;
  previous_patronymic?: string;
  previous_passport_series_number?: string;
  previous_passport_issued_at?: string;
  education_type: number;
  marital_status: number;
  number_of_dependants?: number;
  second_document_type: number;
  loan_purpose: number;
  contact_persons?: {
    name: string;
    type: number;
    phone: string;
  };
  additional_phone: string;
}

export interface EmploymentSimpleCreditParamsDTO {
  employment_type: number;
  private_practice_type?: number;
  organization_activity?: number;
  current_job_phone?: string;
  current_job_address?: any; // dadata object
  current_job_name?: any; // dadata object
  current_job_experience?: number;
  current_job_position?: number;
  current_job_category?: number | null;
  profession?: number;
  monthly_income: number;
  has_additional_income: number;
  additional_monthly_income?: number;
  monthly_outcome?: number;
  supporting_document_type?: number;
  lawyer_id?: string;
  lawyer_region?: string;
  lawyer_license?: string;
  current_job_name_raw?: any;
}
