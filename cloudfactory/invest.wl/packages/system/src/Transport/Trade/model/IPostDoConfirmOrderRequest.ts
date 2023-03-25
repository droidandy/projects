export interface IPostDoConfirmOrderRequestRequest {
  orderRequestId: string;
  code: string;
  agreement?: string;
}

export interface IPostDoConfirmOrderRequestResponse {
  OrderId: number;
}
