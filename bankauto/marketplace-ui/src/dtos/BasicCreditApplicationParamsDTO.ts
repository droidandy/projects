export interface CreditInsurance {
  type: number;
  company_name: number;
  tariff: number;
  term: number;
  included: boolean;
  amount: number;
}

export interface BasicCreditApplicationParamsDTO {
  product_type: string;
  vehicle_state: string;
  vehicle_type: number;
  brand_model: number;
  actual_address_dadata: any;
  registration_address_accommodation_type: number;
  registration_address_dadata: any;
  passport_series_number: string;
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
  current_msisdn_attributes: number | string;
  additional_msisdn_attributes?: number;
  insurances: CreditInsurance[];
  promo?: string;
}
