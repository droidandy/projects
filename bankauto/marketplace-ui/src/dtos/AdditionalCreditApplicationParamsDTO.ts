export interface AdditionalCreditApplicationParamsDTO {
  family_type_cid: number;
  dependent_person_count: number;
  education_cid: number;
  contact_person_full_name: string;
  contact_person_phone_number: number;
  contact_person_type: number;
  additional_document_type_cid: number;
  additional_document_full_name?: string;
  additional_document_issued_at?: string;
}
