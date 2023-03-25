import { EDocumentResponseStatus } from './IDocumentDTO';

export interface IDocumentConfirmRequest {
  tx_id: string;
  code: string;
}

export interface IDocumentConfirmResponse {
  status?: EDocumentResponseStatus;
  message?: string;
  order_id?: string;
  trade_id?: string;
}
