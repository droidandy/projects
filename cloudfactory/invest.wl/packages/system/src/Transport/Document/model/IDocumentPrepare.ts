import { EDocumentResponseStatus } from './IDocumentDTO';

export interface IDocumentPrepareRequest {
  documents: string[];
}

export interface IDocumentPrepareResponse {
  status: EDocumentResponseStatus;
  message?: string;
  tx_id?: string;
  ttl?: string;
  phone?: string;
}
