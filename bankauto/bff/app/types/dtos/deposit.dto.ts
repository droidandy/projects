import { DepositOptions } from '@marketplace/ui-kit/types';

export type DepositRatesDTO = {
  id: number;
  term: number;
  turnover: number;
  options: DepositOptions;
  rate: string;
  addition: string;
  created_at: number;
  updated_at: number;
};
