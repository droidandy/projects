import { IDaDataBankDTO } from './IDaDataBankDTO';

export interface IDaDataBankRequest {
  query: string;
}

export interface IDaDataBankResponse {
  suggestions: IDaDataBankDTO[];
}
