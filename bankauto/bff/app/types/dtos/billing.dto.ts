export interface PaymentOrderDTO {
  id: number;
  external_id: number;
  status: number;
  created_at: number;
  updated_at: number;
  currency: string;
  gateway: string;
  amount: number;
  return_url: string;
  fail_url: string;
  signature: string;
  hold_url: string;
}
