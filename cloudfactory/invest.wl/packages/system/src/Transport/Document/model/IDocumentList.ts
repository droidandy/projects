import { EDocumentStatus, EDocumentType } from './IDocument';

export interface IDocumentListRequest {
  source_id?: string;
  // EDDocumentStatus[].join
  statuses?: string;
  // EDDocumentType[].join
  types?: string;
  limit?: number;
  offset?: number;
}

export interface IDocumentListResponse {
  document: IDocument[];
}

export interface IDocument {
  id: string;
  create_date: string;
  title: string;
  type: EDocumentType;
  status: EDocumentStatus;
  storage_link: string;
  document_sign: { sign_date: string };
  formattedDate: string;
}
