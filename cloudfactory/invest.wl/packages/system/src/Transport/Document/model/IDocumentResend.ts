import { EDocumentResponseStatus } from './IDocumentDTO';

export interface IDocumentResendRequest {
  tx_id: string;
}

export interface IDocumentResendResponse {
  status: EDocumentResponseStatus;
  message?: string;
  ttl?: string;
}
