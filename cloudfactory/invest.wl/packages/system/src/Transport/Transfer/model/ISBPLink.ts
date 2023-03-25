export interface ISBPLinkRequest {
  accessToken: string;
  sum: number;
  contractNumber: string;
  tradeCode?: string;
}

export interface IISBPLinkResponse {
  success: boolean;
  limit: number;
  overdraft: number;
  fee: number;
  link: string;
  id: string;
  errorCode: number;
  errorDesc: string;
}
