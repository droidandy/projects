export interface InsurancePoliciesDto {
  id: number;
  application_external_insurance_id: number;
  policy_number: string;
  insurance_period_month: number;
  valid_from: string;
  valid_to: string;
  car_mark: string;
  car_model: string;
  vin_number: string;
  car_modification: string;
  number_plate: string;
  printed_form: string;
  insurance_type: string;
}

export interface InsuranceDto {
  id: number;
  application_id: number;
  order_id: string;
  order_sum: number;
  product_type: string;
  partner: string;
  external_status: string;
  internal_status: string;
  owner: {
    last_name: string;
    first_name: string;
    patronymic_name: string;
  };
  policies: InsurancePoliciesDto[];
}
