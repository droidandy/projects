import { EDocumentResponseStatus } from './IDocumentDTO';

export interface IDocumentCreateRequest {
  document_templates: string[];
  source_object_id?: string;
  source_object_type?: number;
}

export interface IDocumentCreateResponse {
  status: EDocumentResponseStatus;
  message?: string;
}
