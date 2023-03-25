export interface EmploymentCreditApplicationParamsDTO {
  occupation_form_cid: number;
  name_dadata: any;
  address_dadata: any;
  business_line_cid?: number;
  official_phones?: number;
  experience_cid?: number;
  position_cid?: number;
  qualification_cid?: number;
  profession_cid?: number;
  month_income: number;
  loan_payments: number;
  additional_income?: number;
  additional_income_type?: number;
  income_proof_document_cid?: number;
  lawyer_id?: string;
  lawyer_region?: string;
  lawyer_licence?: string;
}
